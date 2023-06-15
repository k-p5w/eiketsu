/* -----------------------------------------------------
 |  英傑大戦のデッキ名を作るブックマークレット          |
//  document.querySelector("#app > ekt-main").shadowRoot.querySelector("#contents > section.cmn_frame.pad_m.mb80.detail_data.enemy > div > section.general_score > table > tbody > tr.general_data.cost_power")
//  document.querySelector("#app > ekt-main").shadowRoot.querySelector("#contents > section.cmn_frame.pad_m.mb80.detail_data.enemy > div > section.general_score > table")
//  document.querySelector("#app > ekt-main").shadowRoot.querySelector("#contents > section.cmn_frame.pad_m.mb80.detail_data.enemy > div > section.general_score > table > tbody > tr:nth-child(3) > th")
    const score = {
        unitName: "武将名",
        eraName: "時代",
        stratagem: "計略",
        attack: "突撃/槍撃/走射/斬撃/射撃",
        Base: "拠点",
        defeat、撃破
    };
 ------------------------------------------------------*/
javascript: (async () => {
    /* これなら動く */
    const sep = "-";
    let deckName = "";
    const deckUnitMap = new Map();
    const mapMVP = new Map();

    console.log(document.title + " start!");
    /*  対戦相手のテーブル要素を取得する*/
    const table = document.querySelector("#app > ekt-main").shadowRoot.querySelector("#contents > section.cmn_frame.pad_m.mb80.detail_data.enemy > div > section.general_score > table");

    /* テーブルが存在しない場合は処理を終了*/
    if (!table) {
        console.log('テーブルが見つかりません');
        return;
    }
    let stratagemFlg = false;
    let attackFlg = false;
    let defeatFlg = false;
    let baseAttackFlg = false;
    let unitName = "";
    let baseAttack = 0;
    let defeat = 0;
    let stratagem = 0;
    let attack = 0;
    let scorePT = 0;
    let deckCnt = 0;
    let labelRow = 0;
    /* テーブルの行ごとに処理を実行*/
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        /* 行内の各セルにアクセスする例*/
        const cellsTH = row.getElementsByTagName('th');
        for (let j = 0; j < cellsTH.length; j++) {

            if (i > 0) {
                if (j > deckCnt) {
                    continue;
                }
            }

            const cell = cellsTH[j];
            let headItem = cell.textContent.trim().replace(/[\n\t]+/g, sep);
            /* これでデータがとれるようになった！ */
            console.log(headItem + ' <== !!!');
            /* MVP導出用case */
            switch (headItem) {

                case "撃破":
                    defeatFlg = true;
                    stratagemFlg = false;
                    attackFlg = false;
                    baseAttackFlg = false;
                    labelRow = i;
                    break;
                case "計略":
                    stratagemFlg = true;
                    defeatFlg = false;
                    attackFlg = false;
                    baseAttackFlg = false;
                    labelRow = i;
                    break;
                case "突撃":
                case "槍撃":
                case "走射":
                case "斬撃":
                case "射撃":
                    attackFlg = true;
                    stratagemFlg = false;
                    defeatFlg = false;
                    baseAttackFlg = false;
                    labelRow = i;
                    break;
                case "城門":
                case "城壁":
                    baseAttackFlg = true;
                    stratagemFlg = false;
                    defeatFlg = false;
                    attackFlg = false;
                    labelRow = i;
                    break;
                default:
                    stratagemFlg = false;
                    defeatFlg = false;
                    attackFlg = false;
                    baseAttackFlg = false;
                    console.log(headItem + '--> skip');
                    continue;
            }
        }
        /* 行内の各セルにアクセスする例*/
        const cellsTD = row.getElementsByTagName('td');
        for (let j = 0; j < cellsTD.length; j++) {

            if (i > 0) {
                /* ブランク列をskipする */
                if (j > deckCnt) {
                    continue;
                }
                unitName = deckUnitMap.get(j);
            }
            console.log(unitName + ' > start. <');
            const cell = cellsTD[j];
            console.log(' -- td -- ' + i + ',' + j + ' ---- ');
            /* これでデータがとれるようになった！ */
            let item = cell.textContent.trim().replace(/[\n\t]+/g, sep);

            const result = item.split(sep);
            let keyFlg = false;
            let itemLabel = "etc:";
            result.forEach((element) => {
                switch (element) {
                    case "三国志":
                    case "平安":
                    case "戦国":
                    case "春秋戦国":
                    case "特殊":

                        eraName = element;
                        keyFlg = true;
                        break;
                    default:
                        /* 武将名の時 */
                        if (keyFlg) {

                            unitName = element;
                            itemLabel = "name:";
                            keyFlg = false;
                        }

                        if (stratagemFlg) {
                            itemLabel = "計略:";
                            stratagem = parseInt(element);
                        }
                        if (defeatFlg) {
                            itemLabel = "撃破:";
                            defeat = parseInt(element);
                        }

                        if (attackFlg) {
                            itemLabel = "攻撃関連:";
                            attack = parseInt(element);
                        }
                        if (baseAttackFlg) {
                            itemLabel = "攻城関連:";
                            baseAttack = parseInt(element);

                        }
                        console.log(itemLabel + element);
                }

            });

            /* ブランクのところは配列を作らないようにする */
            if (unitName == "武将名") {
                /* 配列に詰めなくていいとき */
                console.log(unitName + '--> set skip --> continue!');
                continue;
            } else {
                /* scoreを加算していく */
                if (i > 0) {
                    let score = mapMVP.get(j);

                    /* スコアの累積,計略の重みを重くする */
                    scorePT = score + (defeat * 2) + (stratagem * 10) + (attack * 1) + (baseAttack * 5);

                    /* スコアのリセット */
                    switch (true) {
                        case stratagemFlg:
                        case defeatFlg:
                        case attackFlg:
                        case baseAttackFlg:
                            defeat = 0;
                            stratagem = 0;
                            attack = 0;
                            baseAttack = 0;

                            console.log(score + '--> score reset!! ');


                    }

                } else {
                    if (deckCnt < j) {
                        deckCnt = j;
                    }

                }

                /* 配列を作っていく */
                console.log("[" + j + "]" + unitName + '(' + scorePT + ')--> set!');
                console.log(`[${j}]${unitName}(${scorePT}) --> set!!!`);
                deckUnitMap.set(j, unitName);
                mapMVP.set(j, scorePT);


                unitName = "武将名";
                scorePT = 0;
            }

        }
    }

    let pt1st = 0;
    let pt2nd = 0;
    let unit1st = "";
    let unit2nd = "";

    /* ためたスコアからMVPを導出する */
    mapMVP.forEach((value, key) => {

        console.log(`key: ${key}:value: ${value} >  pt2nd: ${pt2nd}`);

        if (value > pt1st) {
            pt2nd = pt1st;
            unit2nd = unit1st;
            pt1st = value;
            unit1st = key;
        }
        if (value > pt2nd && value != pt1st) {
            pt2nd = value;
            unit2nd = key;
        }
    });

    let deckOption ="";
    if (deckCnt < 4) {
        deckOption = (deckCnt + 1) + "枚";
    }


    console.log(`1st name: ${deckUnitMap.get(unit1st)}, pt: ${pt1st}`);
    console.log(`2nd name: ${deckUnitMap.get(unit2nd)}, pt: ${pt2nd}`);

    deckName=`vs${deckOption}${deckUnitMap.get(unit1st)}と${deckUnitMap.get(unit2nd)}のデッキ`;
    console.log(deckName);
    await navigator.clipboard.writeText(deckName);
})();

