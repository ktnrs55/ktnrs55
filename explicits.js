define(['questAPI'], function(Quest){
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;
	
    /**
	* Page prototype
	*/
    API.addPagesSet('basicPage',{
        noSubmit:false, //Change to true if you don't want to show the submit button.
        header: 'Questionnaire',
        decline: true,
        declineText: isTouch ? 'Decline' : '回答しない', 
        autoFocus:true, 
        progressBar:  'Page <%= pagesMeta.number %> out of 3'
    });
	
    /**
	* Question prototypes
	*/
    API.addQuestionsSet('basicQ',{
        decline: 'true',
        required : true, 		
        errorMsg: {
            required: isTouch 
                ? 'Please select an answer, or click \'Decline\'' 
                : 'Please select an answer, or click \'Decline to Answer\''
        },
        autoSubmit:'true',
        numericValues:'true',
        help: '<%= pagesMeta.number < 3 %>',
        helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.'
    });

    API.addQuestionsSet('basicSelect',{
        inherit :'basicQ',
        type: 'selectOne'
    });
	
    API.addQuestionsSet('basicDropdown',{
        inherit :'basicQ',
        type : 'dropdown',
        autoSubmit:false
    });
	
    API.addQuestionsSet('therm',{
        inherit: 'basicSelect',
        answers: [
            {text:'10 - 非常に好ましい', value:10},
            {text:'9 - とても好ましい', value:9},
            {text:'8 - 適度に好ましい', value:8},
            {text:'7 - まあまあ好ましい', value:7},
            {text:'6 - 少し好ましい', value:6},
            {text:'5 - 好ましくも好ましくなくもない', value:5},
            {text:'4 - 少し好ましくない', value:4},
            {text:'3 - まあまあ好ましくない', value:3},
            {text:'2 - 適度に好ましくない', value:2},
            {text:'1 - とても好ましくない', value:1},
            {text:'0 - 非常に好ましくない', value:0}
        ]
    });

	
    /**
	*Specific questions
	*/	
    API.addQuestionsSet('attributes7',{
        inherit : 'basicSelect',
        name: 'attributes7',
        stem: 'あなたを最も良く表す言葉はどれですか？',
        answers: [
            {text:'私は非常に <%= global.whiteLabels %> を <%= global.blackLabels %> より好む.',value:7},
            {text:'私は適度に <%= global.whiteLabels %> を <%= global.blackLabels %> より好む.',value:6},
            {text:'私は少し  <%= global.whiteLabels %> を <%= global.blackLabels %> より好む.',value:5},
            {text:'私は <%= global.whiteLabels %> と <%= global.blackLabels %> を同じくらい好む.',value:4},
            {text:'私は少し <%= global.blackLabels %> を <%= global.whiteLabels %> より好む.',value:3},
            {text:'私は適度に <%= global.blackLabels %> を <%= global.whiteLabels %> より好む.',value:2},
            {text:'私は非常に <%= global.blackLabels %> を <%= global.whiteLabels %> より好む.',value:1}
        ]
    });
	
    API.addQuestionsSet('thermBlack',{
        inherit : 'therm',
        name: 'Tblack_0to10',
        stem: '<b><%= global.blackLabels %></b> に対して、どのくらい好ましさを感じますか?'
    });

    API.addQuestionsSet('thermWhite',{
        inherit : 'therm',
        name: 'Twhite_0to10',
        stem: '<b><%= global.whiteLabels %></b> に対して、どのくらい好ましさを感じますか?'
    });

    API.addSequence([
        {
            mixer : 'random', 
            data : [
                {
                    mixer : 'random', 
                    wrapper:true, 
                    data : [
                        {
                            inherit:'basicPage', 
                            questions: {inherit:'thermBlack'}
                        },
                        {
                            inherit:'basicPage', 
                            questions: {inherit:'thermWhite'}							
                        }
                    ]
                },
                {
                    inherit:'basicPage', 
                    questions: {inherit:'attributes7'}
                }
            ]
        }
    ]);

    return API.script;
});
