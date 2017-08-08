package org.bd2k.metaprot;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class MetaprotApplicationTests {

	@Test
	public void contextLoads() {
	}
	@Test
	public void testSetup() {
		String str= "I am done with Junit setup";
		assertEquals("I am done with Junit setup",str);
	}

}
