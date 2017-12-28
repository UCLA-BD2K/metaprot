package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.IntegrationToolResults;
import org.bd2k.metaprot.model.Task;
import org.bd2k.metaprot.util.Globals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Web controller for all Integration Tool related
 * presentation logic.
 *
 * Created by Nate Sookwongse on 10/12/17.
 */

@Controller
@RequestMapping("/integration-tool")
public class IntegrationTool {

    @Autowired
    private DAOImpl dao;


    // for path construction
    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    @RequestMapping(method = RequestMethod.GET)
    public String getIntegrationToolIndex() {  // home page
        return "index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getIntegrationToolResults(Model model, @PathVariable("token") String token) {

        // get task information from database
        Task task = dao.getTask(token);
        IntegrationToolResults results = dao.getIntegrationToolResults(task);
        model.addAttribute("tableRows", results.getTableRows());
        model.addAttribute("nodes", results.getNodes());
        model.addAttribute("edges", results.getEdges());


        return "integration_tool_table";
    }


    @RequestMapping(value = "/visual/{token}", method = RequestMethod.GET)
    public String getIntegrationToolVisual(Model model, @PathVariable("token") String token) {

        // get task information from database
        Task task = dao.getTask(token);
        IntegrationToolResults results = dao.getIntegrationToolResults(task);
        model.addAttribute("nodes", results.getNodes());
        model.addAttribute("edges", results.getEdges());


        return "integration_tool_visual";
    }

}

