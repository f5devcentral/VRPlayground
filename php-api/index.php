<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require __DIR__ . '/vendor/autoload.php';

ini_set('display_errors','Off');
ini_set('error_reporting', E_ALL );

$app = new \Slim\App();

$app->post('/type-juggling', function (Request $request, Response $response) {
    $res = [];
    try {
        $body = $request->getParsedBody();
        $password = $body["password"];
        $res["result"] = (strcmp($password, "admin") == 0);
    } catch (Exception $e) {
        $res["error"] = $e->getMessage();
        return $response->withStatus(500)->withJson($res);
    }

    return $response->withStatus(200)->withJson($res);
});

$app->post('/xxe', function (Request $request, Response $response) {
    $res = [];
    try {
        $body = $request->getParsedBody()["xml"];
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        if (!$doc->loadXML($body, LIBXML_DTDLOAD | LIBXML_NOENT)) {
            $errors = libxml_get_errors();
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->message;
            }
            libxml_clear_errors();
            $res["error"] = 'XML parsing error: ' . implode(', ', $errorMessages);
            return $response->withStatus(500)->withJson($res);
        }
        $processedXml = $doc->saveXML();
        $xmlElement = simplexml_load_string($processedXml);
        $res["result"] = json_decode(json_encode($xmlElement), true);
    } catch (Exception $e) {
        $res["error"] = $e->getMessage();
        return $response->withStatus(500)->withJson($res);
    }

    return $response->withStatus(200)->withJson($res);
});


$app->run();