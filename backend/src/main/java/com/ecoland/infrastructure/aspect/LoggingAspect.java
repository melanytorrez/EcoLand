package com.ecoland.infrastructure.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Aspecto para el registro automático de logs en los controladores web.
 * Captura la entrada, salida, tiempo de ejecución y posibles errores.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Intercepta todos los métodos en las clases anotadas con @RestController o dentro de paquetes de controladores
    @Around("within(@org.springframework.web.bind.annotation.RestController *) || execution(* com.ecoland.infrastructure.adapter.in.web..*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        logger.debug(">>> Entrando al método: {}.{}() con argumentos: {}", className, methodName, safeArgsForLog(className, methodName, args));

        try {
            Object proceed = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;
            
            logger.info("<<< Saliendo del método: {}.{}() | Tiempo de ejecución: {}ms", className, methodName, executionTime);
            return proceed;
            
        } catch (Throwable e) {
            long executionTime = System.currentTimeMillis() - start;
            logger.error("!!! Error en el método: {}.{}() | Mensaje: {} | Tiempo hasta el fallo: {}ms", 
                          className, methodName, e.getMessage(), executionTime);
            throw e;
        }
    }

    private String safeArgsForLog(String className, String methodName, Object[] args) {
        String lowerClass = className.toLowerCase(Locale.ROOT);
        String lowerMethod = methodName.toLowerCase(Locale.ROOT);

        // En flujos de autenticación no se registran argumentos por seguridad.
        if (lowerClass.contains("auth") || lowerMethod.contains("login") || lowerMethod.contains("register")) {
            return "[REDACTED_AUTH_ARGS]";
        }

        return Arrays.stream(args)
                .map(this::maskSensitiveValue)
                .collect(Collectors.joining(", ", "[", "]"));
    }

    private String maskSensitiveValue(Object arg) {
        if (arg == null) {
            return "null";
        }

        String value = String.valueOf(arg);
        String lowerValue = value.toLowerCase(Locale.ROOT);
        if (lowerValue.contains("password") || lowerValue.contains("token") || lowerValue.contains("secret")) {
            return "[REDACTED]";
        }

        return value;
    }
}
