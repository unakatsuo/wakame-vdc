class VolumesController < ApplicationController
  respond_to :json
  include Util
  
  def index
  end
  
  # POST volumes/create.json
  def create
    
    # Convert to MB
    size = case params[:unit]
      when 'gb'
        params[:size].to_i * 1024
      when 'tb'
        params[:size].to_i * 1024 * 1024
    end
        
    # snapshot_id = params[:snapshot_id] #option
    # storage_pool_id = params[:storage_pool_id] #option
    
    data = {
      :volume_size => size,
      # :storage_pool_id => storage_pool_id,
      # :snapshot_id => snapshot_id
    }
    
    @volume = Frontend::Models::DcmgrResource::Volume.create(data)
    
    render :json => @volume
  end
  
  # DELETE volumes/delete.json
  def delete
    account_id = current_account.uuid
    volume_ids = params[:ids]
    response = []
    volume_ids.each do |volume_id|
      response << Frontend::Models::DcmgrResource::Volume.destroy(account_id,volume_id)
    end
    render :json => response
  end
  
  # GET volumes/show/1.json
  def show
    volumes = Frontend::Models::DcmgrResource::Volume.show(current_account.uuid)
    
    volumes.each do |volume|
      volume["size"] = convert_from_mb_to_gb(volume["size"]).to_s + 'GB'
    end

    page = params[:id].to_i
    limit = 10
    from = ((page -1) * limit).to_i
    to = (from + limit -1).to_i
    respond_with(volumes[from..to],:to => [:json])
  end
  
  # GET volumes/detail/vol-24f1af4d.json
  def detail
    detail = Frontend::Models::DcmgrResource::Volume.detail(current_account.uuid)
    detail["size"] = convert_from_mb_to_gb(detail["size"]).to_s + 'GB'
    respond_with(detail,:to => [:json])
  end
end