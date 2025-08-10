package com.vrplayground.java_api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.google.gson.Gson;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.stream.XMLInputFactory;
import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.AbstractMap;
import java.util.Base64;
import java.util.Map;

@SpringBootApplication
@RestController
public class JavaApiApplication {

    @RequestMapping(value = "/xxe", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> xxe(@RequestBody Map<String, Object> body) {
        Gson gson = new Gson();
        Map<String, Object> response;
        int statusCode = 200;

        try {
            String payload = (String) body.get("xml");

            // Configure XMLInputFactory to allow DTD and external entities.
            XMLInputFactory xif = XMLInputFactory.newInstance();
            xif.setProperty(XMLInputFactory.SUPPORT_DTD, true);
            xif.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, true);

            // Use the custom XMLInputFactory with XmlMapper.
            XmlMapper xmlMapper = new XmlMapper(xif);
            JsonNode node = xmlMapper.readTree(payload);

            // Convert the JsonNode into a Map to produce a proper JSON object.
            ObjectMapper jsonMapper = new ObjectMapper();
            Map<String, Object> xmlMap = jsonMapper.convertValue(node, Map.class);

            response = Map.ofEntries(
                    new AbstractMap.SimpleEntry<>("result", xmlMap)
            );
        } catch (Exception ex) {
            statusCode = 500;
            response = Map.ofEntries(
                    new AbstractMap.SimpleEntry<>("error", ex.getMessage())
            );
        }

        return ResponseEntity.status(statusCode).body(gson.toJson(response));
    }

    @RequestMapping(value = "/deserialization", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deserialization(@RequestBody Map<String, Object> body) {
        Gson gson = new Gson();
        Map<String, Object> response;
        int statusCode = 200;

        try {
            String payload = (String) body.get("object");
            byte[] buffer = Base64.getDecoder().decode(payload);
            ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(buffer));
            Object obj = in.readObject();
            response = Map.ofEntries(
                    new AbstractMap.SimpleEntry<>("result", obj.toString())
            );
        } catch (Exception ex) {
            statusCode = 500;
            response = Map.ofEntries(
                    new AbstractMap.SimpleEntry<>("error", ex.getMessage())
            );
        }

        return ResponseEntity.status(statusCode).body(gson.toJson(response));
    }

    public static void main(String[] args) {
        SpringApplication.run(JavaApiApplication.class, args);
    }
}