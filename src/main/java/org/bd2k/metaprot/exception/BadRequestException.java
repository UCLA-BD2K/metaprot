package org.bd2k.metaprot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by allengong on 8/12/16.
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    public BadRequestException(){
        super("There was an error with your request.");
    }

    public BadRequestException(String reason) {
        super(reason);
    }
}
