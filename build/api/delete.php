<?php

    $postId = htmlspecialchars($_POST["id"]);
    $postPw = htmlspecialchars($_POST["pw"]);

    if ($postId && $postPw) {
        if (file_exists("../data/archives.json")) {
            $json = file_get_contents("../data/archives.json");
            $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
            $array = json_decode($json, true);
            $flg = false;
            $arrayNew = array();
            $array2 = $array["data"];
            for ($i = 0; $i < count($array2); $i++) {
                if ($array2[$i]["id"] === $postId && $array2[$i]["pw"] === $postPw) {
                    array_push($arrayNew, array(
                        "delete" => "1",
                        "id" => $array2[$i]["id"],
                        "date" => $array2[$i]["date"],
                        "pw" => $array2[$i]["pw"],
                        "image" => $array2[$i]["image"],
                        "name" => $array2[$i]["name"],
                        "message" => $array2[$i]["message"]
                    ));
                    $flg = true;
                } else {
                    array_push($arrayNew, $array2[$i]);
                }
            }
            if ($flg) {
                $array = array(
                    "data" => $arrayNew
                );
                $json = fopen("../data/archives.json", "w");
                flock($json, LOCK_SH);
                fwrite($json, json_encode($array, JSON_PRETTY_PRINT));
                fclose($json);
                echo(json_encode(array(
                    "code" => 0,
                    "msg" => "メッセージカードを削除しました"
                ), true));
            } else {
                echo(json_encode(array(
                    "code" => 1,
                    "msg" => "メッセージカードの削除に失敗しました、削除用パスワードが違うか、対象となるメッセージカードが確認できません"
                ), true));
            }
        } else {
            echo(json_encode(array(
                "code" => 2,
                "msg" => "メッセージカードの削除に失敗しました、対象となるアーカイブデータが存在しません"
            ), true));
        }
    } else {
        echo(json_encode(array(
            "code" => 3,
            "msg" => "メッセージカードの削除に失敗しました、対象となるメッセージカードとパスワードが確認できません"
        ), true));
    }

?>