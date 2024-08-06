package com.ssafy.smru.util;


import com.ssafy.smru.entity.EmergencyRoom;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class EmergencyRoomDomParser {

    public static List<EmergencyRoom> fetchEmergencyRoomList(String response) throws ParserConfigurationException, IOException, SAXException {
        // XML 문자열을 InputStream으로 변환
        InputStream inputStream = new ByteArrayInputStream(response.getBytes(StandardCharsets.UTF_8));
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(inputStream);
        Element root = doc.getDocumentElement();
        NodeList items = root.getElementsByTagName("item");
        List<EmergencyRoom> parseResult = new ArrayList<>();
        for (int i=0; i<items.getLength(); i++) {
            Node item = items.item(i);
            parseResult.add(toEmergencyRoom(item));
        }

        return parseResult;
    }

    private static EmergencyRoom toEmergencyRoom(Node item) {
        EmergencyRoom emergencyRoom = new EmergencyRoom();
        NodeList subNodes = item.getChildNodes();
        for (int j=0; j< subNodes.getLength(); j++) {
            Node sub = subNodes.item(j);
            if (sub.getNodeName().equals("hpid")) {
                emergencyRoom.setHpid(sub.getTextContent());
            } else if (sub.getNodeName().equals("hvec")) {
                emergencyRoom.setHvec(Integer.parseInt(sub.getTextContent()));
            } else if (sub.getNodeName().equals("hvoc")) {
                emergencyRoom.setHvoc(Integer.parseInt(sub.getTextContent()));
            }
        }
        return emergencyRoom;
    }
}
