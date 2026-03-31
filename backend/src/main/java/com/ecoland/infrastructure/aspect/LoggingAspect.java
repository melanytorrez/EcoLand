package com.ecoland.infrastructure.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

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

        logger.debug(">>> Entrando al método: {}.{}() con argumentos: {}", className, methodName, Arrays.toString(args));

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
}
