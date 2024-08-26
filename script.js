// 天候やロールタイプが変更されたときに自動的にコマンドを生成
document.getElementById('weather').addEventListener('change', updateDiceCommand);
document.getElementById('rollType').addEventListener('change', updateDiceCommand);
// equipment と elevation の選択ボックスを仮定
document.getElementById('equipment').addEventListener('change', updateDiceCommand);
document.getElementById('elevation').addEventListener('change', updateDiceCommand);

function updateDiceCommand() {
    const weather = document.getElementById('weather').value;
    const rollType = document.getElementById('rollType').value;
    const equipment = document.getElementById('equipment').value;  // 装備の選択
    const elevation = document.getElementById('elevation').value;  // 標高の選択

    let correction0 = 0;
    let correction1 = 0;
    let correction2 = 0;

    // 戦闘技能の定義
    const combatSkills = ['回避', 'キック', '組み付き', 'こぶし', '頭突き', '投擲', 'マーシャルアーツ', '拳銃', 'サブマシンガン', 'ショットガン', 'マシンガン', 'ライフル'];
    // 探索技能の定義
    const explorationSkills = ['応急手当', '鍵開け', '隠す', '隠れる', '聞き耳', '忍び歩き', '写真術', '精神分析', '追跡', '登攀', '図書館', '目星'];
    // 行動技能の定義
    const actionSkills = ['運転', '機械修理', '重機械操作', '乗馬', '水泳', '制作', '操縦', '跳躍', '電気修理', 'ナビゲート', '変装'];
    // 交渉技能の定義
    const negotiationSkills = ['言いくるめ', '信用', '説得', '値切り', '母国語'];
    // 知識技能の定義
    const knowledgeSkills = ['医学', 'オカルト', '化学', 'クトゥルフ神話', '芸術', '経理', '考古学', 'コンピュータ', '心理学', '人類学', '生物学', '地質学', '電子工学', '天文学', '博物学', '物理学', '法律', '薬学', '歴史'];

    // 装備による補正を設定
    if (equipment === 'light_equipment') {
        if (['登攀', 'ナビゲート', '跳躍', '回避'].includes(rollType)) {
            correction0 = 5;  // プラス補正の場合、正の値
        }
    }

    // 標高による補正を設定
    if (elevation === 'death_zone') {  // 仮に標高が高い場合
        if (rollType === '幸運') {
            correction1 = -30;
        }
    }

    // 天候による補正を設定
    if (weather === 'snow') {
        if (rollType === 'ナビゲート') {
            correction2 = -10;
        } else if (explorationSkills.includes(rollType)) {
            correction2 = -20;
        }
    } else if (weather === 'wind') {
        if (rollType === 'ナビゲート' || explorationSkills.includes(rollType) || actionSkills.includes(rollType)) {
            correction2 = -30;
        }
    } else if (weather === 'blizzard') {
        if (combatSkills.includes(rollType) || explorationSkills.includes(rollType) || actionSkills.includes(rollType) || negotiationSkills.includes(rollType) || knowledgeSkills.includes(rollType)) {
            correction2 = -50;
        }
    }

    // 補正の合計を計算
    const totalCorrection = correction0 + correction1 + correction2;

    // 選択されたロールタイプによってコマンドを生成
    let command = '';
    if (rollType === '回復量1d3') {
        command = '1d3';
    } else if (rollType === '回復量2d3') {
        command = '2d3';
    } else if (rollType === 'CCB') {
        command = `CCB<={${rollType}}`;
    } else if (['STR', 'CON', 'POW', 'DEX', 'APP', 'SIZ', 'INT', 'EDU'].includes(rollType)) {
        command = `1d100<={${rollType}}*5`;
    } else {
        command = `1D100<={${rollType}}${totalCorrection >= 0 ? '+' : ''}${totalCorrection}　【${rollType}】`;
    }

    // コマンドを表示
    document.getElementById('diceCommand').textContent = command;
}

// 初期化時にコマンドを生成
updateDiceCommand();

document.getElementById('copyCommand').addEventListener('click', function() {
    const commandText = document.getElementById('diceCommand').textContent;
    navigator.clipboard.writeText(commandText).then(() => {
        alert('コマンドがクリップボードにコピーされました');
    });
});