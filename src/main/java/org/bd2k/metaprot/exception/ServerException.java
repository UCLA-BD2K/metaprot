package org.bd2k.metaprot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by allengong on 8/15/16.
 */
@ResponseStatus(value = HttpStatus.SERVICE_UNAVAILABLE)
public class ServerException extends RuntimeException {

    public ServerException() {
        super("Internal server error.");
    }

    public ServerException(String reason) {
        super(reason);
    }
}
