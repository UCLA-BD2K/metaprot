package org.bd2k.metaprot.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Web controller for temporal pattern recognition.
 *
 * Created by Abineet on 8/31/2016.
 */
@Controller
@RequestMapping("/temporal-pattern-recognition")
public class PatternRecognition {

    @RequestMapping(method = RequestMethod.GET)
    public String getPatternRecognitionIndex(){
        return "pattern_recognition_index";
    }


}
