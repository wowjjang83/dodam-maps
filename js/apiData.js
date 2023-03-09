window.addEventListener("load",()=>{

// 주소 > XML > EMD Code
function getEmdCd(_si, _gu, _dong){
    /*
    var _si = "서울특별시";
    var _gu = "중랑구";
    var _dong = "망우동";
    var _bunji = "386-1";
    var _addr = _si+" "+_gu+" "+_dong;
    */

    var _addr = _si+" "+_gu+" "+_dong;

    // XML 파일 로드
    $.ajax({
    type: "GET",
    url: "./xml/emd_code.xml",
    dataType: "xml",
    success: function(xml) {
        
        $(xml).find('item').each(function(){
            var sch_addr = $(this).find('addr').text();
            if(sch_addr == _addr){
                var _code = $(this).find('code').text();
                var _yn = $(this).find('yn').text();
                console.log("_code : "+_code);
                console.log("_yn : "+_yn);
                
                if(_yn == "존재"){
                    var _emdcd = _code.substring(0,8);
                    console.log("_emdcd : "+_emdcd);
                    //get_pnu(_addr, _emdcd);
                    return _emdcd;
                }else{
                    // 없어졌음
                    return "존재하지않음";
                }                
            }
        });
    },
    error: function() {
        // XML 파일 로드 실패 시 실행할 코드
        //console.log('XML 파일을 로드할 수 없습니다.');
        return 'XML 파일을 로드할 수 없습니다.';
    }
    });
}

// 2D데이터 API 2.0 레퍼런스
// 참고 : https://www.vworld.kr/dev/v4dv_2ddataguide2_s002.do?svcIde=cadastral
function getPnu(_si, _gu, _dong, _jibun){
    /*
    var _si = "서울특별시";
    var _gu = "중랑구";
    var _dong = "망우동";
    var _bunji = "386-1";
    var _f_addr = _si+" "+_gu+" "+_dong+" "+_bunji;
    */

    var _emdcd = getEmdCd(_si, _gu, _dong);
    if(_emdcd == "존재하지않음"){
        console.log("변경되거나 없어진 주소")
        return "ERROR : EMD CODE 생성실패";
    }else if(_emdcd == "XML 파일을 로드할 수 없습니다."){
        console.log("getEmdCd 함수에서 ./xml/emd_code.xml  XML 로드 실패")
        return "ERROR : EMD CODE 생성실패";
    }

    var _f_addr = _si+" "+_gu+" "+_dong+" "+_bunji;
    
    var _apikey = vw_apikey;

    //var _pnu = "1126010500103860001"; <-- 위 주소로 이게 출력되면 끝
    $.ajax({
        type: "get",
        url: "http://api.vworld.kr/req/data?",
        data : {
            request: "GetFeature", //필수 // GetFeature, GetFeatureType
            key: _apikey, // 필수
            data: "LP_PA_CBND_BUBUN", // 데이터셋명
            geomFilter:"",
            attrFilter:"addr:=:"+_f_addr+"|emdCd:=:"+_emdcd,  // pnu는 단일검색인듯
            columns: "pnu", // 출력할 필드명(콤마구분)
            attribute:"true" // 속성 반환여부
        },
        dataType: 'jsonp',
        async: false,
        success: function(data) {
            
            console.log(data);
            console.log("---------------------");
            console.log("PNU : "+data.response.result.featureCollection.features[0].properties.pnu);

            // PNU 값 리턴
            return data.response.result.featureCollection.features[0].properties.pnu;            
        },
        error: function(xhr, stat, err) {
            console.log("ERROR xhr : "+JSON.stringify(xhr));
            console.log("ERROR stat : "+stat);
            
            var _err = "ERROR : [xhr] "+JSON.stringify(xhr)+" / [stat] "+stat;
            return _err;
        }
    });
}

// 2D데이터 API 2.0 레퍼런스
// 참고 : https://www.vworld.kr/dev/v4dv_2ddataguide2_s002.do?svcIde=cadastral
// PNU > API > 폴리곤 좌표값 반환
// Return : Object { coord: Array[1] , pnu , jibun }
function getGeomCoord(_pnu){
    var _apikey = vw_apikey;
    //var _pnu = "1165010300100560000";

    $.ajax({
        type: "get",
        url: "http://api.vworld.kr/req/data?",
        data : {
            request: "GetFeature", //필수 // GetFeature, GetFeatureType
            key: _apikey, // 필수
            data: "LP_PA_CBND_BUBUN", // 데이터셋명
            geomFilter:"",
            attrFilter:"pnu:=:"+_pnu,  // pnu는 단일검색인듯
            //columns: "geometry,pnu,jibun", // 출력할 필드명(콤마구분)
            attribute:"true", // 속성 반환여부
            
            //format: "json", // json,xml
            //errorFormat: "json", // json,xml
            //size: "10", // 기본값 10, 최대 1000 // 한페이지에 출력될 응답결과 건수
            //page: "1", // 응답결과 페이지 번호
            // attrFilter : 속성 필터 > pnu, jibun,bonbun,bubun,ag_geom,addr,gosi_year,gosi_month,jiga
            /*
            포맷 : 속성명A:연산자A:비교값A|속성명B:연산자B:비교값B

            - 여러 조건은 [|](Shift+\)로 구분하며, 한 조건의 내부는 [:]로 구분함

            속성명 : 연산 대상이 되는 필드명

            연산자 : =, >=, <=, <, >, <>, BETWEEN(포맷 : min,max), LIKE, IN(포맷 : 값1,값2)

            예) attrFilter=uname:like:제2종일반|dyear:between:2000,2015|emdCd:=:41173102

            단, 단일검색=Y가 있는 경우에는 해당속성명(pnu)을 포함할 경우 geomFilter없이 attrFilter만으로 검색 가능
            예) attrFilter=pnu:=:검색값
            */
            //geometry: "true", // 지오메트리 반환여부
            //buffer: 0, // 버퍼거리(단위:m)
            crs: "EPSG:3857" // EPSG:4326
            //callback: ""    // 콜백함수명 json일때만 가능
            //domain: _domain
        },
        dataType: 'jsonp',
        async: false,
        success: function(data) {
            /*
            console.log(data);
            console.log("---------------------");
            */
            var _coord = data.response.result.featureCollection.features[0].geometry.coordinates[0][0];
            var _pnu = data.response.result.featureCollection.features[0].properties.pnu;
            // jibun
            var _jibun = data.response.result.featureCollection.features[0].properties.jibun;
            //console.log("------===========-------- _pnu : "+_pnu);
            /*
            for(var i=0;i<_coord.length;i++){
                console.log("x : "+_coord[i][0]);
                console.log("y : "+_coord[i][1]);
            }
            */
            //add_vwmap_polygon(_coord,_pnu,_jibun);

            var _obj = {
                coord : _coord,
                pnu : _pnu,
                jibun : _jibun
            }
            return _obj;
        },
        error: function(xhr, stat, err) {
            console.log("ERROR xhr : "+JSON.stringify(xhr));
            console.log("ERROR stat : "+stat);
        }
    });
}

});