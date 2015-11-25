<?php

    if (file_exists("../data/archives.json")) {
        $json = file_get_contents("../data/archives.json");
        $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
        $array = json_decode($json, true);
        if ($array === NULL) {
            echo(json_encode(array(
                "code" => 2,
                "msg" => "データが存在しません"
            ), true));
        } else {
            $arrayNew = array();
            $array2 = $array["data"];
            for ($i = 0; $i < count($array2); $i++) {
                if ($array2[$i]["delete"] === "0") {
                    array_push($arrayNew, array(
                        "id" => $array2[$i]["id"],
                        "date" => $array2[$i]["date"],
                        "image" => $array2[$i]["image"],
                        "name" => $array2[$i]["name"],
                        "message" => $array2[$i]["message"]
                    ));
                }
            }
            if (1 <= count($arrayNew)) {
                echo(json_encode(array(
                    "code" => 0,
                    "msg" => "データの取得に成功しました",
                    "data" => $arrayNew
                ), true));
            } else {
                echo(json_encode(array(
                    "code" => 3,
                    "msg" => "データが登録されていません"
                ), true));
            }
        }
    } else {
        echo(json_encode(array(
            "code" => 1,
            "msg" => "ファイルが存在しません"
        ), true));
    }

?>