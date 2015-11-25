<?php

    $postPw = htmlspecialchars($_POST["pw"]);
    $postImage = htmlspecialchars($_POST["image"]);
    $postName = htmlspecialchars($_POST["name"]);
    $postMessage = htmlspecialchars($_POST["message"]);

    date_default_timezone_set('Asia/Tokyo');

    if ($postImage && $postName && $postMessage && $postPw) {
        $id = strval(time());
        $fileName = $id.".png";
        $fp = fopen("../data/".$fileName, "w");
        fwrite($fp, base64_decode($postImage));
        fclose($fp);
        $arrayNew = array(
            "delete" => "0",
            "id" => $id,
            "date" => date('Y/m/d H:i'),
            "pw" => $postPw,
            "image" => $fileName,
            "name" => $postName,
            "message" => $postMessage
        );
        if (file_exists("../data/archives.json")) {
            $json = file_get_contents("../data/archives.json");
            $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
            $array = json_decode($json,true);
            if ($array === NULL) {
                $array = array(
                    "data" => array($arrayNew)
                );
            } else {
                $array2 = $array["data"];
                array_unshift($array2, $arrayNew);
                $array = array(
                    "data" => $array2
                );
            }
        } else {
            $array = array(
                "data" => array($arrayNew)
            );
        }
        $json = fopen("../data/archives.json", "w");
        flock($json, LOCK_SH);
        fwrite($json, json_encode($array, JSON_PRETTY_PRINT));
        fclose($json);
        echo(json_encode(array(
            "code" => 0,
            "msg" => "アップロード完了しました",
            "id" => $id
        ), true));
    }

?>