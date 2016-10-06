package org.bd2k.metaprot.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Web controller that handles general URLs.
 *
 * An example is the / endpoint (homepage).
 *
 * Created by allengong on 10/6/16.
 */
@Controller
public class General {

    @RequestMapping("/")
    public String getHomePage() {
        return "index";
    }

}
