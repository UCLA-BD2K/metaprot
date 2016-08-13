package org.bd2k.metaprot.controller.rest;

import org.bd2k.metaprot.exception.BadRequestException;
import org.bd2k.metaprot.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller that exposes endpoints
 * related to analyzing files.
 *
 * Created by allengong on 8/12/16.
 */
@RestController
@RequestMapping("/analyze")
public class analyze {

    @RequestMapping(value = "/metabolites/{token}", method = RequestMethod.POST)
    public String analyzeMetabolites(@PathVariable("token") String token,
                                     @RequestParam("s3Url") String s3Url,
                                     @RequestParam("pThreshold") double pThreshold,
                                     @RequestParam("fcThreshold") double fcThreshold) {

        // validation
        if (!s3Url.startsWith("something...") && true) {
            // should return error message
            throw new BadRequestException("S3 Url is invalid!");
        }

        if (pThreshold < 0 || fcThreshold < 0) {    // perhaps move to front end

        }

        System.out.println("token " + token);
        System.out.println(s3Url);
        System.out.println(pThreshold);
        System.out.println(fcThreshold);

        throw new ResourceNotFoundException();

        //return "OK";

    }

    @RequestMapping(value = "/getToken", method = RequestMethod.GET)
    public String getToken() {
        return UUID.randomUUID().toString();
    }
}
