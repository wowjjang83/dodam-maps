// 지도 변수
let vwmap;

//브이월드 인증키 > 천태종에서 쓰던것
//let vw_apikey = '429F4193-A25C-31FF-9695-4BE5FE4E43AD';
// 인증키 > 개인테스트용으로 따로 발급받은것
let vw_apikey = "DD59541F-5495-3F50-98F3-54BB5947859C";

//좌표계
let vw_epsg = 'EPSG:3857';
//let vw_epsg = 'EPSG:4326';
//let vw_epsg = 'EPSG:900913';

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
          
  //var vmap = new vw.ol3.Map("vmap",  vw.ol3.MapOptions);
  
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

    vwLeftClickEvent(vwmap);
    ////////////
    /*
    var wmsLayer = new vw.Layers();
    wmsSource = new vw.source.TileWMS();
    wmsSource.setParams("tilesize=256");
    wmsSource.setLayers("LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN".toLowerCase());
    wmsSource.setStyles("LP_PA_CBND_BUBUN_WEBGL,LP_PA_CBND_BONBUN_WEBGL".toLowerCase());
    wmsSource.setFormat("image/png");
    wmsSource.setUrl("https://api.vworld.kr/req/wms?Key="+vw_apikey);
    var wmsTile = new vw.layer.Tile(wmsSource);
    wmsLayer.add(wmsTile);
    vwmap.addLayer(wmsLayer);
    */

    //vwmap.onClick.addEventListener(wfsEvent);

    // 이벤트 지우기
    // vwmap.onClick.removeEventListener(wfsEvent)

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

    console.log("addVwmapPolygon coordinates : ");
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

    

    vector_layer.set('name', 'polygon_layer'); // 레이어 이름 설정
    vector_layer.set('type', 'polygon'); // 레이어 타입 설정
    //vector_layer.set('class', 'temple');
    
    vector_layer.setZIndex(200); // 레이어 z-index 설정
    vector_layer.setVisible(true);
} // End Function addVwmapPolygon()

function vwmapSearchAddr(_opt1, _opt2, _addr){
    //console.log("vwmapSearchAddr() 함수실행 : " + _addr);
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
            //console.log(data);
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

                setMapMode(vw.ol3.BasemapType.PHOTO,2);
                setMapMode('연속지적도',3);
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
            //console.log(data);
            if(data.response.status == "OK"){
                var items = data.response.result.items;
                //var _tot = (items.length>5)? 5:items.length;
                var html = "";
                _opt1 = _opt1.toLowerCase();
                _opt2 = _opt2.toLowerCase();
                var _addr = "";
                var _title = "";

                //console.log("_opt1 : "+_opt1);
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

// 지도 클릭 이벤트
var wfsEvent = function(windowPosition, ecefPosition, cartographic, featureInfo, event) {
    var mh = getBuffer(cartographic.longitudeDD,cartographic.latitudeDD);
    let min = [cartographic.longitudeDD-mh[0],cartographic.latitudeDD-mh[1]]
    let max = [cartographic.longitudeDD+mh[0],cartographic.latitudeDD+mh[1]]
    let box = min[0]+","+min[1]+","+max[0]+","+max[1]
    //var url = `https://api.vworld.kr/req/wfs?key=[인증키]&SERVICE=WFS&version=1.1.0&request=GetFeature&TYPENAME=lp_pa_cbnd_bubun&OUTPUT=application/json&SRSNAME=EPSG:4326&BBOX=${box}`;
    var url = `https://api.vworld.kr/req/wfs?key=${vw_apikey}&SERVICE=WFS&version=1.1.0&request=GetFeature&TYPENAME=lp_pa_cbnd_bubun&OUTPUT=application/json&SRSNAME=${vw_epsg}&BBOX=${box}`;
    url = "https://map.vworld.kr/proxy.do?url=" + encodeURIComponent(url);
    // parser 설명.
    // parser 생성자.
    var parser = new vw.GMLParser();
    parser.setId("aaaa");//아이디 부여
    //var featureInfos = parser.readTemp(vw.GMLParserType.GEOJSON, url, "EPSG:900913");
    // data 읽기. parser.read( 데이터타입, 데이터경로, 데이터좌표계)
    // 전달되는 좌표계를 의미하며, 이 좌표를 웹지엘에서는 EPSG:4326으로 변환하여 사용합니다.
    // 데이터타입. vw.GMLParserType { GEOJSON, GML1, GML2, GML2 }
    //featureInfos = parser.read(vw.GMLParserType.GEOJSON, url, "EPSG:4326");
    featureInfos = parser.read(vw.GMLParserType.GEOJSON, url, vw_epsg);
    //console.log("featureInfos :" , featureInfos);
    var options =         {
        isTerrain : true,    // 지형 따라 출력시 true, 지면에서 위로 출력시 false
        width : 50,      // 선의 경우 크기지정.
        material : new vw.Color(0,255,0,255).ws3dColor.withAlpha(0.2),  // RGBA A값만 255이하로 주면 투명 또는 withAlpha(1.0~0.1)로 설정.
        outline : true,      // 아웃라인지정시 true, 아웃라인 미지정 false
        outlineWidth : 5,    // 아웃라인 너비.
        outlineColor : vw.Color.YELLOW.ws3dColor,    // 아웃라인 색상.
        clampToGround : true,    // 적용이 안되는 것 같습니다.
        height : 1600.0
    };
    // 출력 색상등 지정.
    featureInfos.setOption(options);
    // Point의 경우 이미지 설정. options 항목이 필요없음.
    //featureInfos.setImage("https://map.vworld.kr/images/comm/symbol_05.png");
    // 출력 좌표 설정.
    featureInfos.makeCoords();//생성
    featureInfos.show(); //뷰
};

//대략적인 마우스 클릭 크기에 맞는 BBOX 영역 계산
var getBuffer = function(x,y){
    position = vwmap.getCurrentPosition().position
    // var x = position.x
    // var y = position.y
    var z = position.z
    //111,000KM  1도 단위
    var m = 1/(111000/z*1.48*50);
    var h = 1/(111000/z*1.85*50);
    return [m,h];
}

// 우클릭 이벤트
const onRightClick = (event) => {
    event.preventDefault()
    //console.log("우클릭");

    // 이벤트 발생
    if($('#zone-setup-link').attr("active") == "true")    {
        
        console.log("우클릭");
        // #context-menu 등록
        /*
        var contextMenu = document.getElementById("context-menu");
        contextMenu.style.display = "block";
        contextMenu.style.left = event.clientX + "px";
        contextMenu.style.top = event.clientY + "px";
        $("#context-menu").css("z-index", "4");
        */

        // vwmap addLayer
        //var layer = new vwmap.Layer();
        //layer.setId("context-menu-layer");
        //layer.setZIndex(100);
        //vwmap.addLayer(layer);

        // 메세지 확인/취소 alert
        var message = "필지를 삭제하시겠습니까?";
        var result = confirm(message);
        if(result)  {
            console.log("삭제");
        }else{
            console.log("취소");
        }
    }
}
// onRightClick 등록
addEventListener("contextmenu", onRightClick, false);

let zone_add_list = [];

/* 클릭 이벤트 제어 */
function vwLeftClickEvent(_map){
    _map.on("click", function(evt) {
        var coordinate = evt.coordinate //좌표정보
        var pixel = evt.pixel
        var cluster_features = [];
        var features = [];

        var min = vwmap.getCoordinateFromPixel([evt.pixel[0] -4,evt.pixel[1]+4])
        var max = vwmap.getCoordinateFromPixel([evt.pixel[0] +4,evt.pixel[1]-4])
        var box = min[0]+","+min[1]+","+max[0]+","+max[1]
        //console.log("box : " + box);

        var x = coordinate[0];
        var y = coordinate[1];

        // 구역계설정 중일때만
        if($('#zone-setup-link').attr("active") == "true")    {

            $.ajax({
                type : "get",
                url : "https://api.vworld.kr/req/wfs?key="+vw_apikey+"&domain=http://localhost:8080&SERVICE=WFS&version=1.1.0&"+
                    "request=GetFeature&TYPENAME=lp_pa_cbnd_bubun&OUTPUT=text/javascript&SRSNAME="+vw_epsg+"&"+
                        "BBOX="+box+"&server=dev",
                dataType : 'jsonp',
                async : false,
                jsonpCallback:"parseResponse",
                success : function(data) {
                    
                    var geoJson = new ol.format.GeoJSON();
                    var wfs_feature = geoJson.readFeatures(data);
                    var vectorSource = new ol.source.Vector({features:wfs_feature});
                    var vector_layer = new ol.layer.Vector({
                            source: vectorSource
                    })
                
                    //console.log("data : "+JSON.stringify(data));
                    // JSON.stringify(data);
                    var jdataObj =  JSON.parse(JSON.stringify(data));
                    console.log("jdataObj : "+JSON.stringify(jdataObj));
                    // jdataObj pnu
                    var pnu = jdataObj.features[0].properties.pnu;
                    var addr = jdataObj.features[0].properties.addr;
                    // 면적

                    var _layer_name = pnu;
                    //vector_layer.set("name",_layer_name);

                    var isExist = false;

                    for(var i=0; i<zone_add_list.length; i++){
                        //console.log("저장된 필지 : "+zone_add_list[i].get("name")+ " / 클릭한 필지 : "+_layer_name);
                        if(zone_add_list[i].layer.get("name") == _layer_name){
                            isExist = true;
                            break;
                        }
                    }
                    
                    //console.log("isExist : "+isExist);
                    // 중복 클릭이 아니면
                    if(isExist == false){
                        // 레이어 추가
                        vector_layer.set("name",_layer_name);
                        zone_add_list.push({"layer":vector_layer, "pnu":pnu, "addr":addr, "name":_layer_name, "type":"polygon"});
                        vwmap.addLayer(vector_layer);
                    }else{
                        /*
                        var geom = evt.target;
                        if (geom instanceof ol.geom.Polygon) {
                            var output = formatArea(geom); //영역계산
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        }
                        console.log("output : "+output);
                        */

                        // 중복클릭이면 삭제
                         // 메세지 확인/취소 alert
                        var message = "주소 : "+addr+"\nPNU : "+pnu+"\n필지를 삭제하시겠습니까?";
                        var result = confirm(message);
                        if(result)  {
                            console.log("삭제");
                            var thisLayer = vwmap.getLayerByName(_layer_name);
                            vwmap.removeLayer(thisLayer);
                            // zone_add_list 에서 삭제
                            for(var i=0; i<zone_add_list.length; i++){
                                if(zone_add_list[i].layer.get("name") == _layer_name){
                                    zone_add_list.splice(i,1);
                                    break;
                                }
                            }
                        }else{
                            console.log("취소");
                        }

                    }

                    zoneAddToTable();
                },
                error : function(xhr, stat, err) {
                }
                
            });
            
        }// end if // 구역계설정 중일때만
        
    });// end _map.on("click")
}// end function vwLeftClickEvent()

// 영역 면적계산
/*
var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  };
  */

//구역계 설정 > 위치 > 소재지 > 필지추가 테이블 변경
function zoneAddToTable(){
    var zone_add_table = "";
    var zone_tb_hd = "<tr><th>PNU</th><th>주소</th><th>면적</th></tr>";

    for(var i=0; i<zone_add_list.length; i++){
        zone_add_table += "<tr>";
        zone_add_table += "<td>"+zone_add_list[i].pnu+"</td>";
        zone_add_table += "<td>"+zone_add_list[i].addr+"</td>";
        zone_add_table += "<td>면적</td>";
        //zone_add_table += "<td><button type='button' class='btn btn-default btn-sm' onclick='zoneAddRemove("+i+")'>삭제</button></td>";

        zone_add_table += "</tr>";
    }

    $("#zone-loc").empty();
    $("#zone-loc").html(zone_tb_hd);
    $("#zone-loc").html(zone_add_table);
}
  
/////////////////////////////////
