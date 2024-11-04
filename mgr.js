define(['managerAPI',
		'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@1.*/datapipe.min.js'], function(Manager){


	//You can use the commented-out code to get parameters from the URL.
	//const queryString = window.location.search;
    //const urlParams = new URLSearchParams(queryString);
    //const pt = urlParams.get('pt');

	var API    = new Manager();
	//const subid = Date.now().toString(16)+Math.floor(Math.random()*10000).toString(16);
		    //init_data_pipe(API, 'zpjKaPesdEOI',  {file_type:'csv'});
		    init_data_pipe(API,   'lnDGF04rqEz7',  {file_type:'csv'});
		    

    API.setName('mgr');
    API.addSettings('skip',true);

    //Randomly select which of two sets of category labels to use.
    let raceSet = API.shuffle(['a','b'])[0];
    let blackLabels = [];
    let whiteLabels = [];

    if (raceSet == 'a') {
        blackLabels.push('African Americans');
        whiteLabels.push('European Americans');
    } else {
        blackLabels.push('Black people');
        whiteLabels.push('White people');
    }

    API.addGlobal({
        raceiat:{},
        //YBYB: change when copying back to the correct folder
        baseURL: './images/',
        raceSet:raceSet,
        blackLabels:blackLabels,
        whiteLabels:whiteLabels,
        //Select randomly what attribute words to see. 
        //Based on Axt, Feng, & Bar-Anan (2021).
        //posWords : API.shuffle([
        //    'Love', 'Cheer', 'Friend', 'Pleasure',
        //    'Adore', 'Cheerful', 'Friendship', 'Joyful', 
        //    'Smiling','Cherish', 'Excellent', 'Glad', 
        //    'Joyous', 'Spectacular', 'Appealing', 'Delight', 
         //   'Excitement', 'Laughing', 'Attractive','Delightful', 
        //    'Fabulous', 'Glorious', 'Pleasing', 'Beautiful', 
         //   'Fantastic', 'Happy', 'Lovely', 'Terrific', 
         //   'Celebrate', 'Enjoy', 'Magnificent', 'Triumph'
        //]),
        posWords : API.shuffle([
            '愛', '応援', '友達', '喜び',
	    '愛する', '陽気', '友情', '幸せな',
	    '笑顔', '大切にする', '優れた', '嬉しい',
	    '喜ばしい', '壮大な', '魅力的な', '喜び',
	    '興奮', '笑っている', '魅力的な', '楽しい',
	    '素晴らしい', '輝かしい', '心地よい', '美しい',
	    '素敵', '幸せ', '愛らしい', '最高',
	    '祝う', '楽しむ', '華麗', '勝利', 
        ]),
        //negWords : API.shuffle([
        //    'Abuse', 'Grief', 'Poison', 'Sadness', 
        //    'Pain', 'Despise', 'Failure', 'Nasty', 
        //    'Angry', 'Detest', 'Horrible', 'Negative', 
        //    'Ugly', 'Dirty', 'Gross', 'Evil', 
         //   'Rotten','Annoy', 'Disaster', 'Horrific',  
         //   'Scorn', 'Awful', 'Disgust', 'Hate', 
         //   'Humiliate', 'Selfish', 'Tragic', 'Bothersome', 
         //   'Hatred', 'Hurtful', 'Sickening', 'Yucky'
        //])
	negWords : API.shuffle([
            '虐待', '悲しみ', '毒', '悲しさ', 
            '痛み', '軽蔑', '失敗', '嫌な', 
            '怒っている', '嫌悪する', '恐ろしい', '否定的', 
            '醜い', '汚い', '不快な', '悪', 
            '腐った', 'イライラさせる', '災害', '恐ろしい',  
            '軽蔑', 'ひどい', '嫌悪', '嫌う', 
            '屈辱を与える', '自己中心的', '悲劇的', '面倒な', 
            '憎しみ', '傷つける', '吐き気を催す', '気持ち悪い',
        ])
    });

    API.addTasksSet({
        instructions: [{
            type: 'message',
            buttonText: 'Continue'
        }],

        intro: [{
            inherit: 'instructions',
            name: 'intro',
            templateUrl: 'intro.jst',
            title: 'Intro',
            header: 'Welcome'
        }],

        raceiat_instructions: [{
            inherit: 'instructions',
            name: 'raceiat_instructions',
            templateUrl: 'raceiat_instructions.jst',
	    //templateUrl: 'floweriat_instructions.jst',
            title: 'IAT Instructions',
            header: 'Implicit Association Test'
        }],

        explicits: [{
            type: 'quest',
            name: 'explicits',
            scriptUrl: 'explicits.js'
        }],

        raceiat: [{
            type: 'time',
            name: 'raceiat',
            scriptUrl: 'raceiat.js'
	    //scriptUrl: 'floweriat.js'
        }],

        lastpage: [{
            type: 'message',
            name: 'lastpage',
            templateUrl: 'lastpage.jst',
            title: 'End',
            //Uncomment the following if you want to end the study here.
            //last:true, 
            header: 'You have completed the study'
        }], 
        
        //Use if you want to redirect the participants elsewhere at the end of the study
        redirect:
        [{ 
			//Replace with any URL you need to put at the end of your study, or just remove this task from the sequence below
            type:'redirect', name:'redirecting', url: 'https://www.google.com/search' 
        }],
		
		//This task waits until the data are sent to the server.
        uploading: uploading_task({header: 'just a moment', body:'Please wait, sending data... '})
    });

    API.addSequence([
        { type: 'isTouch' }, //Use Minno's internal touch detection mechanism. 
        
        { type: 'post', path: ['$isTouch', 'raceSet', 'blackLabels', 'whiteLabels'] },

        // apply touch only styles
        {
            mixer:'branch',
            conditions: {compare:'global.$isTouch', to: true},
            data: [
                {
                    type: 'injectStyle',
                    css: [
                        '* {color:red}',
                        '[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
                        '[piq-page] > ol {margin: 15px;}',
                        '[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                        '.container {padding:5px;}',
                        '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
                        '[pi-quest]::after {clear: both;}',
                        '[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
                        '[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',

                        '[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
                        '[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
                        '[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
                        // larger screens
                        '@media (min-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
                        '}',
                        // phones and smaller screens
                        '@media (max-width: 480px) {',
                        ' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
                        ' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
                        '}'
                    ]
                }
            ]
        },
        
        
        {inherit: 'intro'},
        {
            mixer:'random',
            data:[
                {inherit: 'explicits'},

                // force the instructions to preceed the iat
                {
                    mixer: 'wrapper',
                    data: [
                        {inherit: 'raceiat_instructions'},
                        {inherit: 'raceiat'}
                    ]
                }
            ]
        },

		{inherit: 'uploading'},
        {inherit: 'lastpage'},
        {inherit: 'redirect'}
    ]);

    return API.script;
});
