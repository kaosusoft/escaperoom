var themeData = [
    {index:0, 
        name:'웨딩크루즈 살인사건', 
        image: '/images/event/pos_wedding.jpg', 
        miniImage: '/images/event/pos_wedding_land.jpg',
		comment:['탐정이 되어','크루즈에서 일어난','살인사건을 파헤친다.','','난이도 : ★★★☆☆'],
        person: '추천인원 : 2 - 4 (최대인원 : 6)', level : '보통', special : '추리테마',
        substance:['예비부부인 김만술과 레이코는', '부모의 반대에도 불구하고 끈질긴 노력끝에',
        '결국 결혼을 하게되고 신혼여행으로 크루즈여행을 떠나게 된다.','그곳에서 시작된 비극과 숨겨진 비밀..',
        '당신은 탐정이 되어', '크루즈 안에서 단서를 찾아 숨겨진 진실을 밝혀내야 한다.']
    }, // index : 0
	{index:1, 
        name:'스토커', 
        image: '/images/event/pos_stalker.jpg', 
        miniImage: '/images/event/pos_stalker_land.jpg',
		comment:['사이코패스 스토커에게','붙잡혀버린 연인을','구출하기 위해 잠입한다.','','난이도 : ★★★★☆]'],
        person: '추천인원 : 2 - 4 (최대인원 : 6)', level : '약간어려움', special : '커플, 인원분리',
        substance:['사이코패스 스토커는', '쭉 지켜봐온 당신의 연인을 자신의 방에 가두고 있다.',
        '스토커의 타겟이 되어 납치감금된 소중한 사람을', '잠깐 자리를 비운 스토커의 감시망을 피해',
        '무사히 구출해 낼 수 있을것인가?']
    }, 
	{index:2, 
        name:'반 고흐의 방', 
        image: '/images/event/pos_gogh.jpg', 
        miniImage: '/images/event/pos_gogh_land.jpg',
		comment:['고흐의 방으로 시간여행하여,','퍼즐을 풀어 권총을 찾아','고흐의 자살을 막자.','','난이도 : ★★★☆☆]'],
        person: '추천인원 : 2 - 4 (최대인원 : 6)', level : '보통', special : '가족테마',
        substance:['시간 여행자인 당신.','우연히 반 고흐의 마지막 날로 여행하게 되었다.',
        '자살을 앞둔 고흐, 그리고 그와 관련된 비밀들...', '이 모든 것을 풀어 고흐를 자살로부터 구하지 못한다면',
        '영영 시간의 늪에 빠져버릴 것이다.', '자, 이제 당신에게 60분의 타이머가 주어졌다.']
    }, 
	{index:6, 
        name:'괴도 루키', 
        image: '/images/event/pos_rookie.jpg', 
        miniImage: '/images/event/pos_rookie_land.jpg',
		comment:['루키등급의 초보도둑,','괴도등급으로 승급하기 위해','도둑시험을 치른다.','','난이도 : ★★★☆☆]'],
        person: '추천인원 : 2 - 4 (최대인원 : 6)', level : '보통', special : '도둑테마, 전자장치',
        substance:['당신은 최고의 도둑단체 루팡클럽에 입단하여', '아직은 풋내기 [루키]등급이다.',
        '첫 실전때는 선배와 함께 하며 교육을 받았지만', '이번에는 모든 것을 혼자 진행해야 한다!',
        '이번만 잘 해내면 프로등급이 될수 있다고 하는데...', '지금은 [루키]지만 곧 [괴도]가 될 수 있겠지?']
    },
	{index:4, 
        name:'저주받은 집', 
        image: '/images/event/pos_curse.jpg', 
        miniImage: '/images/event/pos_curse_land.jpg',
		comment:['집을 알아보던 중','중개업자에게 속아','귀신들린 집에 들어가버렸다.','','난이도 : ★★★★☆'],
        person: '추천인원 : 2 - 5 (최대인원 : 6)', level : '어려움', special : '적당한 공포',
        substance:['집세가 싸다는 부동산업자의 말에 혹해서','낡은 집을 둘러보게 되었다.',
        '하지만 그 집은 마귀들린 아이와 야반도주한 가족에 대한','흉흉한 소문이 도는 폐가였다.',
        '뽀얗게 먼지가 앉고 전기가 끊긴지도 한참 된 어수선한 풍경.',
        '돌아가야겠다며 현관문을 돌리지만 문은 열리지 않는다...']
    }, 
	{index:7, 
        name:'환상 서유기', 
        image: '/images/event/pos_west_ready.jpg', 
        miniImage: '/images/event/pos_west_land_ready.jpg',
		comment:['리뉴얼 중입니다.'],
        person: '추천인원 : 2 - 4 (최대인원 : 4)', level : '보통', special : '판타지, 전자장치',
        substance:['리뉴얼 대기중입니다.']
    } // index : 5
]

var myThemeList = [0, 1, 2, 6, 4, 7];

exports.getThemes = function () {
    var data = [];
    for(var i=0; i<myThemeList.length; i++){
        for(var j=0; j<themeData.length; j++){
            if(themeData[j].index == myThemeList[i]){
                data.push(themeData[j]);
            }
        }    
    }
    return data;
}