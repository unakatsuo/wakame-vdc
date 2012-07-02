DcmgrGUI.prototype.imagePanel = function(){
  var total = 0;
  var maxrow = 10;
  var page = 1;
  var list_request = { 
    "url":DcmgrGUI.Util.getPagePath('/machine_images/list/',page),
    "data" : DcmgrGUI.Util.getPagenateData(page,maxrow)
  }
  
  DcmgrGUI.List.prototype.getEmptyData = function(){
    return [{
      "id":'',
      "wmi_id":'',
      "source":'',
      "owner":'',
      "visibility":'',
      "state":''
    }]
  }
  
  DcmgrGUI.Detail.prototype.getEmptyData = function(){
        return {
            "name" : "-",
            "description" : "-",
            "source" : "-",
            "owner" : "-",
            "visibility" : "-",
            "product_code" : "-",
            "state" : "-",
            "karnel_id":"-",
            "platform" : "-",
            "root_device_type":"-",
            "root_device":"-",
            "image_size":"-",
            "block_devices":"-",
            "virtualization":"",
            "state_reason":"-"
          }
      }
  
  var close_button_name = $.i18n.prop('close_button'); 
  var launch_button_name = $.i18n.prop('launch_button');
  var update_button_name = $.i18n.prop('update_button');
  
  var c_pagenate = new DcmgrGUI.Pagenate({
    row:maxrow,
    total:total
  });
  
  var c_list = new DcmgrGUI.List({
    element_id:'#display_images',
    template_id:'#imagesListTemplate',
    maxrow:maxrow,
    page:page
  });
      
  c_list.setDetailTemplate({
    template_id:'#imagesDetailTemplate',
    detail_path:'/machine_images/show/'
  });
  
  c_list.element.bind('dcmgrGUI.contentChange',function(event,params){
    var image = params.data.image;
    c_pagenate.changeTotal(image.total);
    c_list.setData(image.results);
    c_list.singleCheckList(c_list.detail_template);

    var edit_machine_image_buttons = {};
    edit_machine_image_buttons[close_button_name] = function() { $(this).dialog("close"); };
    edit_machine_image_buttons[update_button_name] = function(event) {
      var image_id = $(this).find('#image_id').val();
      var display_name = $(this).find('#machine_image_display_name').val();
      var description = $(this).find('#machine_image_description').val();
      var data = 'display_name=' + display_name
                +'&description=' + description;

      var request = new DcmgrGUI.Request;
      request.put({
        "url": '/machine_images/'+ image_id +'.json',
        "data": data,
        success: function(json, status){
          bt_refresh.element.trigger('dcmgrGUI.refresh');
        }
      });
      $(this).dialog("close");
    }

    var bt_edit_machine_image = new DcmgrGUI.Dialog({
      target:'.edit_machine_image',
      width:500,
      height:250,
      title:$.i18n.prop('edit_machine_image_header'),
      path:'/edit_machine_image',
      button: edit_machine_image_buttons,
      callback: function(){
        var params = { 'button': bt_edit_machine_image, 'element_id': 1 };
        $(this).find('#machine_image_display_name').bind('paste', params, DcmgrGUI.Util.availableTextField);
        $(this).find('#machine_image_display_name').bind('keyup', params, DcmgrGUI.Util.availableTextField);
      }
    });

    bt_edit_machine_image.target.bind('click',function(event){
      var uuid = $(this).attr('id').replace(/edit_(wmi-[a-z0-9]+)/,'$1');
      if( uuid ){
        bt_edit_machine_image.open({"ids":[uuid]});
      }
      c_list.checkRadioButton(uuid);
    });

    $(bt_edit_machine_image.target).button({ disabled: false });
  });
  
  var bt_refresh  = new DcmgrGUI.Refresh();
  
  bt_refresh.element.bind('dcmgrGUI.refresh',function(){
    c_list.page = c_pagenate.current_page;
    list_request.url = DcmgrGUI.Util.getPagePath('/machine_images/list/',c_pagenate.current_page);
    list_request.data = DcmgrGUI.Util.getPagenateData(c_pagenate.start,c_pagenate.row);
    c_list.element.trigger('dcmgrGUI.updateList',{request:list_request})
    
    //update detail
    $.each(c_list.checked_list,function(check_id,obj){
     
     //remove
     $($('#detail').find('#'+check_id)).remove();
     
     //update
     c_list.checked_list[check_id].c_detail.update({
       url:DcmgrGUI.Util.getPagePath('/machine_images/show/',check_id)
     },true);
    });
  });
  
  c_pagenate.element.bind('dcmgrGUI.updatePagenate',function(){
    c_list.clearCheckedList();
    $('#detail').html('');
    bt_refresh.element.trigger('dcmgrGUI.refresh');
  });
  
  var launch_instance_buttons = {};
  launch_instance_buttons[close_button_name] = function() { $(this).dialog("close"); };  
  launch_instance_buttons[launch_button_name] = function() {
    var image_id = $(this).find('#image_id').val();
    var display_name = $(this).find('#display_name').val();
    var host_name = $(this).find('#host_name').val();
    var instance_spec_id = $(this).find('#instance_specs').val();
    var ssh_key_pair = $(this).find('#ssh_key_pair').find('option:selected').text();
    var launch_in = $(this).find('#right_select_list').find('option');
    var user_data = $(this).find('#user_data').val();
    var security_groups = [];
    $.each(launch_in,function(i){
     security_groups.push("security_groups[]="+ $(this).text());
    });
    var vifs = [];
    for (var i=0; i < 5 ; i++) {
        vifs.push("vifs[]="+ $(this).find('#eth' + i).val());
    }      

    var data = "image_id="+image_id
              +"&instance_spec_id="+instance_spec_id
              +"&host_name="+host_name
              +"&user_data="+user_data
              +"&" + security_groups.join('&')
              +"&" + vifs.join('&')
              +"&ssh_key="+ssh_key_pair
              +"&display_name="+display_name;
    
    request = new DcmgrGUI.Request;
    request.post({
      "url": '/instances',
      "data": data,
      success: function(json,status){
       bt_refresh.element.trigger('dcmgrGUI.refresh');
      }
    });
    $(this).dialog("close");
  }
  
  var bt_launch_instance = new DcmgrGUI.Dialog({
    target:'.launch_instance',
    width:583,
    height:600,
    title:$.i18n.prop('launch_instance_header'),
    path:'/launch_instance',
    callback: function(){
      var self = this;
      
      var loading_image = DcmgrGUI.Util.getLoadingImage('boxes');
      $(this).find('#select_ssh_key_pair').empty().html(loading_image);
      $(this).find("#left_select_list").mask($.i18n.prop('loading_parts'));
      
      var request = new DcmgrGUI.Request;
      var is_ready = {
        'instance_spec': false,
        'ssh_keypair': false,
        'security_groups': false,
        'networks': false,
        'display_name': false
      };

      var ready = function(data) {
        if(data['instance_spec'] == true &&
           data['ssh_keypair'] == true &&
           data['security_groups'] == true &&
           data['networks'] == true &&
           data['display_name'] == true) {  
          bt_launch_instance.disabledButton(1, false);
        } else {
          bt_launch_instance.disabledButton(1, true);
        }
      }

      $(this).find('#display_name').keyup(function(){
       if( $(this).val() ) {
         is_ready['display_name'] = true;
         ready(is_ready);
       } else {
         is_ready['display_name'] = false;
         ready(is_ready);
       }
      });

      parallel({
        //get instance_specs
        instance_specs: 
          request.get({
            "url": '/instance_specs/all.json',
            success: function(json,status){
              var select_html = '<select id="instance_specs" name="instance_specs"></select>';
              $(self).find('#select_instance_specs').empty().html(select_html);

              var results = json.instance_spec.results;
              var size = results.length;
              var select_instance_specs = $(self).find('#instance_specs');
              if(size > 0) { 
                is_ready['instance_spec'] = true;
              }

              for (var i=0; i < size ; i++) {
                var uuid = results[i].result.uuid;
                var html = '<option value="'+ uuid +'">'+uuid+'</option>';
                select_instance_specs.append(html);
              }
            }
          }),
        //get ssh key pairs
        ssh_keypairs: 
          request.get({
            "url": '/keypairs/all.json',
            "data": "",
            success: function(json,status){
              var select_html = '<select id="ssh_key_pair" name="ssh_key_pair"></select>';
              $(self).find('#select_ssh_key_pair').empty().html(select_html);

              var results = json.ssh_key_pair.results;
              var size = results.length;
              var select_keypair = $(self).find('#ssh_key_pair');
              if(size > 0) {
                is_ready['ssh_keypair'] = true;
              }

              for (var i=0; i < size ; i++) {
                var ssh_keypair_id = results[i].result.id;
                var html = '<option id="'+ ssh_keypair_id +'" value="'+ ssh_keypair_id +'">'+ssh_keypair_id+'</option>'
                select_keypair.append(html);
              }
            }
        }),
        //get security groups
        security_groups: 
          request.get({
            "url": '/security_groups/all.json',
            "data": "",
            success: function(json,status){
              var data = [];
              var results = json.security_group.results;
              var size = results.length;
              for (var i=0; i < size ; i++) {
                data.push({
                  "value" : results[i].result.uuid,
                  "name" : results[i].result.uuid,
                });
              }

              var security_group = new DcmgrGUI.ItemSelector({
                'left_select_id' : '#left_select_list',
                'right_select_id' : "#right_select_list",
                "data" : data,
                'target' : self
              });
              
              var on_ready = function(size){
                if(size > 0) {
                  is_ready['security_groups'] = true;
                  ready(is_ready);
                } else {
                  is_ready['security_groups'] = false;
                  ready(is_ready);
                }
              }

              $(self).find('#right_button').click(function(){
                security_group.leftToRight();
                on_ready(security_group.getRightSelectionCount());
              });

              $(self).find('#left_button').click(function(){
                security_group.rightToLeft();
                on_ready(security_group.getRightSelectionCount());
              });
            }
        }),

        //get networks
        networks: 
          request.get({
            "url": '/networks/all.json',
            "data": "",
            success: function(json,status){
              var create_select_item = function(name) {
                var select_html = '<select id="' + name + '" name="' + name + '"></select>';
                $(self).find('#select_' + name).empty().html(select_html);
                return $(self).find('#' + name);
              }

              var append_select_item = function(select_item, uuid) {
                select_item.append('<option value="'+ uuid +'">'+uuid+'</option>');
              }

              var create_select_eth = function(name, results) {
                var select_eth = create_select_item(name);
                append_select_item(select_eth, 'none')
                append_select_item(select_eth, 'disconnected')

                for (var i=0; i < size ; i++) {
                  append_select_item(select_eth, results[i].result.uuid)
                }
              }

              var results = json.network.results;
              var size = results.length;

              is_ready['networks'] = true;
              ready(is_ready);

              for (var i=0; i < 5 ; i++) {
                create_select_eth('eth' + i, results);
              }                
            }
          })

      }).next(function(results) {
        $("#left_select_list").unmask();
      });
    },
    button: launch_instance_buttons
  });
  
  bt_launch_instance.target.bind('click',function(){
    var id = c_list.currentChecked();
    if( id ){
      bt_launch_instance.open({"ids":[id]});
      bt_launch_instance.disabledButton(1, true);
    }
    return false;
  });
  
  $(bt_launch_instance.target).button({ disabled: false });
  $(bt_refresh.target).button({ disabled: false });
  //list
  c_list.setData(null);
  c_list.update(list_request,true);
}
