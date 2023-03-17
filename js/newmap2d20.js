// 지도 변수
let vwmap;

//브이월드 인증키 > 천태종에서 쓰던것
//let vw_apikey = '429F4193-A25C-31FF-9695-4BE5FE4E43AD';
// 인증키 > 개인테스트용으로 따로 발급받은것
let vw_apikey = "DD59541F-5495-3F50-98F3-54BB5947859C";

//좌표계
//let vw_epsg = 'EPSG:3857';
//let vw_epsg = 'EPSG:4326';
let vw_epsg = 'EPSG:900913';

// 브이월드 베이스맵
// 참고 : https://www.vworld.kr/dev/v4dv_opn2dmap2exam_s002.do?exaIde=EXAID_07000000000002&tabMenu=m1&searchKeyword=
function vwmapBaseCreate(_layer, __lng=127.100616,__lat=37.402142){
    
    vw.ol3.MapOptions = {
        basemapType: vw.ol3.BasemapType.GRAPHIC
      , controlDensity: vw.ol3.DensityType.EMPTY
      , interactionDensity: vw.ol3.DensityType.BASIC
      , controlsAutoArrange: true
      , homePosition: vw.ol3.CameraPosition
      , initPosition: vw.ol3.CameraPosition
     }; 
        
    vwmap = new vw.ol3.Map(_layer,  vw.ol3.MapOptions);
    vwmap.getView().setZoom(8);
    /*
    var _center = [ 14269340.84717533, 4359656.953474675 ];
    vwmap.getView().setCenter(_center);
    */

    
	 vw.ol3.MapOptions = {
        basemapType: vw.ol3.BasemapType.GRAPHIC
      , controlDensity: vw.ol3.DensityType.EMPTY
      , interactionDensity: vw.ol3.DensityType.BASIC
      , controlsAutoArrange: true
      , homePosition: vw.ol3.CameraPosition
      , initPosition: vw.ol3.CameraPosition
  }; 
          
  var vmap = new vw.ol3.Map("vmap",  vw.ol3.MapOptions);
  
    /* vw.ol3.SiteAlignType = {
        NONE : "none",
        TOP_LEFT:	"top-left",
        TOP_CENTER : "top-center",
        TOP_RIGHT : "top-right",
        CENTER_LEFT: "center-left",
        CENTER_CENTER: "center-center",
        CENTER_RIGHT : "center-right",
        BOTTOM_LEFT : "bottom-left",
        BOTTOM_CENTER : "bottom-center",
        BOTTOM_RIGHT : "bottom-right"
    }; */
    var options = {
        map: vwmap
        , site : vw.ol3.SiteAlignType.TOP_CENTER   //"top-left"
        , vertical : false
        , collapsed : false
        , collapsible : false
    };

    var _toolBtnList = [
        new vw.ol3.button.Init(vwmap),
        new vw.ol3.button.ZoomIn(vwmap),
        new vw.ol3.button.ZoomOut(vwmap),
        new vw.ol3.button.DragZoomIn(vwmap),
        new vw.ol3.button.DragZoomOut(vwmap) ,
        new vw.ol3.button.Pan(vwmap),				
        new vw.ol3.button.Prev(vwmap),
        new vw.ol3.button.Next(vwmap),
        new vw.ol3.button.Full(vwmap),
        new vw.ol3.button.Distance(vwmap),
        new vw.ol3.button.Area(vwmap)  
    ];

    var toolBar = new vw.ol3.control.Toolbar(options);
    toolBar.addToolButtons(_toolBtnList);
    vwmap.addControl(toolBar);

    setMapMode(vw.ol3.BasemapType.PHOTO_HYBRID);
}// end vwmapBaseCreate()

// 맵 모드 변경
//setMode(vw.ol3.BasemapType.GRAPHIC); 2D배경지도
//setMode(vw.ol3.BasemapType.GRAPHIC_GRAY); 2D배경지도 회색
//setMode(vw.ol3.BasemapType.GRAPHIC_NIGHT); 2D배경지도 야간
//setMode(vw.ol3.BasemapType.PHOTO); 2D항공지도
//setMode(vw.ol3.BasemapType.PHOTO_HYBRID); 2D영상지도
var _crrMapMode = 4;
function setMapMode(basemapType,_id) {    
    //console.log($("#map-mode-li-4 a").attr("active"));
    if(_id == 3){
        var _3_active = $("#map-mode-li-3 a").attr("active");
        if( _3_active == "false"){
            /*
            let Base = new ol.layer.Tile({
                name: 'Base',
                source: new ol.source.XYZ({
                    url: 'http://api.vworld.kr/req/wmts/1.0.0/' + vw_apikey + '/Base/{z}/{y}/{x}.png' // WMTS API 사용
                })
            });
            let Satellite = new ol.layer.Tile({
                name: 'Satellite',
                source: new ol.source.XYZ({
                    url: 'http://api.vworld.kr/req/wmts/1.0.0/' + vw_apikey + '/Satellite/{z}/{y}/{x}.jpeg' // WMTS API 사용
                })
            });
            let Hybrid = new ol.layer.Tile({
                name: 'Hybrid',
                source: new ol.source.XYZ({
                    url: 'http://api.vworld.kr/req/wmts/1.0.0/' + vw_apikey + '/Hybrid/{z}/{y}/{x}.png' // WMTS API 사용
                })
            });

            //map-content에 ol지도 지정
            
            vwmap = new ol.Map({
                target: "vwmap",
                layers: [Satellite],
                view: new ol.View({
                    center: vwmap.getView().getCenter(),
                    zoom: vwmap.getView().getZoom(),
                })
            })
            */

            let Hybrid = new ol.layer.Tile({
                name: 'Hybrid',
                source: new ol.source.XYZ({
                    url: 'http://api.vworld.kr/req/wmts/1.0.0/' + vw_apikey + '/Hybrid/{z}/{y}/{x}.png' // WMTS API 사용
                })
            });

            //map-content에 ol지도 지정
            
            let WMS_name, WMS_id;
            WMS_id = "lp_pa_cbnd_bubun";
            WMS_name = "WMS_LAYER";
        
            var wms_title = '지적도';
            var wms_val = 'lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun';
            
            let wms_tile = new ol.layer.Tile({
                name : WMS_name,
                source : new ol.source.TileWMS({
                    url : 'https://api.vworld.kr/req/wms?',
                    params : {
                        LAYERS : wms_val,
                        STYLES : wms_val,
                        CRS : vw_epsg,
                        apikey : vw_apikey,
                        title : wms_title,
                        FORMAT : 'image/png',
                        domain : "http://localhost"
                    }
                })
            });
            // wms_tile 투명도
            wms_tile.setOpacity(0.8);
            // wms_tile 배경투명
            wms_tile.set('transparent', true);

            //vwmap.addLayer(Hybrid);
            vwmap.addLayer(wms_tile);            
        }
    }else{
        vwmap.setBasemapType(basemapType);    
    }
    /*
    $("map-mode-li-"+_crrMapMode).removeClass("active");
    $("map-mode-li-"+_id).addClass("active");
    */
    $("#map-mode-li-"+_crrMapMode+" a").attr("active","false");
    $("#map-mode-li-"+_id+" a").attr("active","true");
    _crrMapMode = _id;    
}

// 브이월드 맵 이동
function vwmapMove(_lng, _lat,_addr, _title=""){
    //console.log("_lng : "+_lng+", _lat : "+_lat);
    _lng = parseFloat(_lng);
    _lat = parseFloat(_lat);
    var _center = [ _lng, _lat ];
    vwmap.getView().setCenter(_center);
    // zoom
    vwmap.getView().setZoom(18);
    //vwmap.getView().setCenter(new ol.proj.transform([_lng, _lat], "EPSG:3857", vw_epsg));

    if(_title != ""){
        $('.sch input').val(_title);
        $('.map-con .title h1').text(_title);
    }else{
        $('.sch input').val(_addr);
        $('.map-con .title h1').text(_addr);
    }

    // $('.map-con .title) 등장 animate
    
    $('.map-con .title').animate({
        top: 50
    },500);
    
    // 맵에 툴바 활성
    //$('#vwmap .vw-toolbar').css('display', 'block');
    // animate
    $('#vwmap .vw-toolbar').animate({
        top: 100,
        opacity: 1
    },500);

    $('.sch .search-list').css('display', 'none');   
}

// 폴리곤 그리기
function addVwmapPolygon(coordinates,_pnu,_jibun){

    let polygon_feature = new ol.Feature({
        geometry: new ol.geom.Polygon([ coordinates ])
        
    }); // polygon_feature 생성

    // 폴리곤에 텍스트 입력
    var text = new ol.style.Text({
        font: '18px Nanum Gothic',
        fill: new ol.style.Fill({ color: '#fff' }),
        stroke: new ol.style.Stroke({
            color: '#fff', width: 1
        }),
        text: _jibun
    });

    let style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [255, 0, 0, 1],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: [255, 0, 0, 0.5]
        }),
        text:text
    }); // 스타일 정의

    polygon_feature.setStyle(style); // 정의한 스타일을 적용

    let vector_layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [polygon_feature]
        }),
        title: _jibun,
        style: style,
        zIndex: 100
    });

    vwmap.addLayer(vector_layer);

    // 마우스 오버 이벤트 제어
    // 나중에 추가 테스트

    /* 클릭 이벤트 제어 */
    vwmap.on("click", function(evt) {
        var coordinate = evt.coordinate //좌표정보
        var pixel = evt.pixel
        var cluster_features = [];
        var features = [];

        //선택한 픽셀정보로  feature 체크 
        vwmap.forEachFeatureAtPixel(pixel, function(feature, layer) {
            var feature_title = feature.get("title");
            var layer_title = layer.get("title");

            // 나중에 추가 테스트
            
        });
    });

    vector_layer.set('name', 'polygon_layer'); // 레이어 이름 설정
    vector_layer.set('type', 'polygon'); // 레이어 타입 설정
    //vector_layer.set('class', 'temple');
    
    vector_layer.setZIndex(200); // 레이어 z-index 설정
    vector_layer.setVisible(true);
} // End Function addVwmapPolygon()

function vwmapSearchAddr(_opt1, _opt2, _addr){
    console.log("vwmapSearchAddr() 함수실행 : " + _addr);
    // ajax
    $.ajax({
        url: "https://api.vworld.kr/req/search",
        type: "GET",
        data: {
            service: "search",
            request: "search",
            version: "2.0",
            key: vw_apikey,
            query: _addr,
            type: _opt1,
            category: _opt2, // or ROAD
            crs: vw_epsg,
            errorformat: "json"
        },
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
            if(data.response.status == "OK"){
                var items = data.response.result.items;
                var lat = items[0].point.y;
                var lng = items[0].point.x;
                var _get_addr = "";
                var _title = "";

                _opt1 = _opt1.toLowerCase();
                _opt2 = _opt2.toLowerCase();

                if(_opt1 == "address"){
                    _get_addr = items[0][_opt1][_opt2];
                    
                }else if(_opt1 == "place"){
                    _get_addr = items[0].address.parcel;
                    _title = items[0].title;
                    
                }

                vwmapMove(lng,lat,_get_addr,_title);
            }
        }
    });
}

// 관련주소리스트 출력
function vwmapSearchAddrList(_opt1,_opt2,_keyword){
    //console.log("vwmapSearchAddrList() 함수실행 : " + _keyword);
    // ajax
    $.ajax({
        url: "https://api.vworld.kr/req/search",
        type: "GET",
        data: {
            service: "search",
            request: "search",
            version: "2.0",
            key: vw_apikey,
            query: _keyword,
            type: _opt1,//"ADDRESS",
            category: _opt2,//"PARCEL", // or ROAD
            size: 5,
            crs: vw_epsg,
            errorformat: "json"
        },
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
            if(data.response.status == "OK"){
                var items = data.response.result.items;
                //var _tot = (items.length>5)? 5:items.length;
                var html = "";
                _opt1 = _opt1.toLowerCase();
                _opt2 = _opt2.toLowerCase();
                var _addr = "";
                var _title = "";

                console.log("_opt1 : "+_opt1);
                for(var i=0; i<items.length; i++){
                    var _lng = items[i].point.x;
                    var _lat = items[i].point.y;
                    
                    html += "<a href='javascript:vwmapMove(\""+_lng+"\",\""+_lat+"\",";

                    if(_opt1 == "address"){
                        _addr = items[i][_opt1][_opt2];
                        html +=  "\""+_addr+"\");'><li>";
                        html +=  "<b>"+_addr+"</b>";
                    }else if(_opt1 == "place"){
                        _addr = items[i].address.parcel;
                        _title = items[i].title;
                        html +=  "\""+_addr+"\",\""+_title+"\");'><li>";
                        var _cate_list = items[i].category.split(" > ");
                        var _last_cate = _cate_list[_cate_list.length-1];
                        html += "["+_last_cate+"] <b>"+_title+"</b>";
                    }else if(_opt1 == "district"){
                        /* 행정구역은 미구현
                        var _cate_list = items[i].category.split(" > ");
                        var _last_cate = _cate_list[_cate_list.length-1];
                        html += "<li><a href='javascript:vwmapSearchAddr(\""+items[i].title+"\");'><b>"+items[i].title+"</b></a></li>";
                        */
                    }
                    html +=  "</li></a>";
                }
                $("#searchAddrList").html(html);
            }
        }
    });
}
