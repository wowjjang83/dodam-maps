// 지도 변수
let vwmap;

//브이월드 인증키
let vw_apikey = '429F4193-A25C-31FF-9695-4BE5FE4E43AD';
//좌표계
//let vw_epsg = 'EPSG:3857';
//let vw_epsg = 'EPSG:4326';
let vw_epsg = 'EPSG:900913';

// 브이월드 맵 생성
function vwmapCreate(_layer, __lng=127.100616,__lat=37.402142){

    // __lng 값이 없으면 서을 lng값
    const _lng = __lng;
    const _lat = __lat;

    //브이월드 WMTS(BASE) 지정
    //http://api.vworld.kr/req/wmts/1.0.0/{key}/{layer}/{tileMatrix}/{tileRow}/{tileCol}.{tileType}
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
    //console.log("vwmapCreate() : " + _layer);
    //console.log("_lat : " + _lat + ", _lng : " + _lng);
    //map-content에 ol지도 지정
    vwmap = new ol.Map({
        target: _layer,
        layers: [Satellite],
        view: new ol.View({
            center: new ol.proj.transform([__lng,__lat], 'EPSG:4326', vw_epsg),
            zoom: 17,
        })
    })
    //center: new ol.proj.transform([127.100616, 37.402142], 'EPSG:4326', vw_epsg),
    //var vSAT = new vworld.Layers.Satellite('VSAT');
    //vwmap.addLayer(vSAT);

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
            }
        })
    });
    vwmap.addLayer(wms_tile);

    // vwmap 줌인/줌아웃 버튼 비활성화
    vwmap.getControls().forEach(function(control){
        if(control instanceof ol.control.Zoom){
            vwmap.removeControl(control);
        }
    });

    //$(".ol-rotate-reset").css("display","none");
} // End Function vwmapCreate()

// 브이월드 맵 이동
function vwmapMove(_lng,_lat){
    vwmap.getView().setCenter(new ol.proj.transform([_lng, _lat], vw_epsg, vw_epsg));
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

function vwmapSearchAddr(_addr){
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
            type: "ADDRESS",
            category: "PARCEL", // or ROAD
            crs: vw_epsg,
            errorformat: "json"
        },
        dataType: "jsonp",
        success: function (data) {
            //console.log(data);
            if(data.response.status == "OK"){
                var lat = data.response.result.items[0].point.y;
                var lng = data.response.result.items[0].point.x;

                vwmapMove(lng,lat);
            }
        }
    });
}

// 관련주소리스트 출력
function vwmapSearchAddrList(_keyword){
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
            type: "ADDRESS",
            category: "PARCEL", // or ROAD
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
                for(var i=0; i<items.length; i++){
                    html += "<li><a href='javascript:vwmapSearchAddr(\""+items[i].address.parcel+"\");'>"+items[i].address.parcel+"</a></li>";
                }
                $("#searchAddrList").html(html);
            }
        }
    });
}

