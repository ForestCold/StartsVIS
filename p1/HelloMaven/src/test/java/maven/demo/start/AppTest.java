package com.imooc.maven01.model;
import org.junit.*;
import org.junit.Assert.*;
publicclassHelloWorldTest{
@Test
publicvoid testSayHello()throwsException{
Assert.assertEquals("Hello World!",newHelloWorld().sayHello());
}
}
