package org.bd2k.metaprot;

import org.bd2k.metaprot.dbaccess.repository.MetaboliteTaskRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created by davidmeng on 8/7/17.
 */

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MetaprotApplication.class)
@WebAppConfiguration
public class AnalyzeControllerTest {
    private MockMvc mockMvc;

    // repositories
    @Autowired
    private MetaboliteTaskRepository metaboliteTaskRepository;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void setup() throws Exception {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();

     }

    @Test
    public void testAnalyzeMetabolites() throws Exception {

        // request with fake token and filename
        this.mockMvc.perform(post("/analyze/metabolites/FAKE_TOKEN")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .param("objectKey", "user-input/FAKE_TOKEN/FAKE_FILENAME")
        )
                .andExpect(status().isBadRequest());

        // request with valid test token and filename. no errors should occur
        this.mockMvc.perform(post("/analyze/metabolites/TEST_TOKEN")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("objectKey", "user-input/TEST_TOKEN/TEST_DEA_FILE")
                .param("taskToken", "TEST_TASK_1")
                .param("pThreshold", "0.05")
                .param("fcThreshold", "0.10")
        )
                .andExpect(status().isOk());

        // check that results were saved on DynamoDB
        assertTrue(metaboliteTaskRepository.exists("TEST_TASK_1"));
        // delete results
        metaboliteTaskRepository.delete("TEST_TASK_1");



    }

    @Test
    public void testCheckIntegrity() throws Exception {

        // request with fake token and filename
        this.mockMvc.perform(post("/analyze/integrity-check")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("objectKey", "user-input/FAKE_TOKEN/FAKE_FILENAME")
                .param("token", "FAKE_TOKEN")
        )
                .andExpect(status().isBadRequest());


        // request with valid test token and filename, but not properly formatted file
        MvcResult result = this.mockMvc.perform(post("/analyze/integrity-check")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("objectKey", "user-input/TEST_TOKEN/TEST_NOT_CSV_FILE")
                .param("token", "TEST_TOKEN")
        )
                .andExpect(status().isBadRequest())
                .andReturn();

        // check error message to verify error is due to formatting of CSV file
        String msg =  result.getResolvedException().getMessage();
        assertTrue(msg.startsWith("There was an issue with your input file:"));

        // request with valid test token and filename. no errors should occur
        this.mockMvc.perform(post("/analyze/integrity-check")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("objectKey", "user-input/TEST_TOKEN/TEST_DEA_FILE")
                .param("token", "TEST_TOKEN")
        )
                .andExpect(status().isOk());


    }
}
