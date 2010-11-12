DcmgrGUI.prototype.storagePoolPanel = function(){
  
  var total = 0;
  var maxrow = 10;
  var page = 1;
  var list_request = { 
    "url":DcmgrGUI.Util.getPagePath('/storage_pools/list/',1),
    "data" : DcmgrGUI.Util.getPagenateData(page,maxrow)
  };
  
  DcmgrGUI.List.prototype.getEmptyData = function(){
    return [{
      "id":'',
      "uuid":'',
      "node_id":'',
      "storage_pool_id":'',
      "status":''
    }]
  }
  
  DcmgrGUI.Detail.prototype.getEmptyData = function(){
    return {
      "id":'-',
      "uuid":'-',
      "node_id":'-',
      "storage_pool_id":'-',
      "status":'-',
      "created_at":'-',
      "updated_at":'-'
    }
  }
  
  var c_pagenate = new DcmgrGUI.Pagenate({
    row:maxrow,
    total:total
  });
  
  var c_list = new DcmgrGUI.List({
    element_id:'#display_storage_pools',
    template_id:'#storagePoolsListTemplate',
    maxrow:maxrow,
    page:page
  });
    
  c_list.setDetailTemplate({
    template_id:'#storagePoolsDetailTemplate',
    detail_path:'/storage_pools/show/'
  });
  
  c_list.element.bind('dcmgrGUI.contentChange',function(event,params){
    var storage_pool = params.data.storage_pool;
    c_pagenate.changeTotal(storage_pool.owner_total);
    c_list.setData(storage_pool.results);
    c_list.multiCheckList(c_list.detail_template);
  });
  
  var bt_refresh  = new DcmgrGUI.Refresh();

  bt_refresh.element.bind('dcmgrGUI.refresh',function(){
    c_list.page = c_pagenate.current_page;
    list_request.url = DcmgrGUI.Util.getPagePath('/storage_pools/list/',c_list.page);
    list_request.data = DcmgrGUI.Util.getPagenateData(c_pagenate.start,c_pagenate.row);
    c_list.element.trigger('dcmgrGUI.updateList',{request:list_request})
    
    //update detail
    $.each(c_list.checked_list,function(check_id,obj){
      $($('#detail').find('#'+check_id)).remove();
      c_list.checked_list[check_id].c_detail.update({
        url:DcmgrGUI.Util.getPagePath('/storage_pools/show/',check_id)
      },true);
    });
  });
  
  c_pagenate.element.bind('dcmgrGUI.updatePagenate',function(){
    c_list.clearCheckedList();
    $('#detail').html('');
    bt_refresh.element.trigger('dcmgrGUI.refresh');
  });
  
  //list
  c_list.setData(null);
  c_list.update(list_request,true);
}