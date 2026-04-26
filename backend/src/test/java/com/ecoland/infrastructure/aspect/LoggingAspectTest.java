package com.ecoland.infrastructure.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoggingAspectTest {

    private final LoggingAspect aspect = new LoggingAspect();

    @Test
    @DisplayName("Should execute method and return result")
    void shouldProceedAndReturnResult() throws Throwable {
        // Arrange
        ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class); // Mock explícito de Signature

        when(signature.getName()).thenReturn("testMethod");
        when(joinPoint.getSignature()).thenReturn(signature);
        when(joinPoint.getTarget()).thenReturn(new Object());
        when(joinPoint.getArgs()).thenReturn(new Object[]{"arg1"});
        when(joinPoint.proceed()).thenReturn("result");

        // Act
        Object result = aspect.logExecutionTime(joinPoint);

        // Assert
        assertThat(result).isEqualTo("result");
        verify(joinPoint).proceed();
    }

    @Test
    @DisplayName("Should propagate exception when method fails")
    void shouldThrowException() throws Throwable {
        // Arrange
        ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class);

        when(signature.getName()).thenReturn("testMethod");
        when(joinPoint.getSignature()).thenReturn(signature);
        when(joinPoint.getTarget()).thenReturn(new Object());
        when(joinPoint.getArgs()).thenReturn(new Object[]{});
        when(joinPoint.proceed()).thenThrow(new RuntimeException("error"));

        // Act & Assert
        assertThatThrownBy(() -> aspect.logExecutionTime(joinPoint))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("error");

        verify(joinPoint).proceed();
    }
}