# -*- coding: utf-8 -*-
module Hijiki::DcmgrResource::V1112
  class Instance < Base
    include Hijiki::DcmgrResource::ListMethods
    include ListTranslateMethods
    include Hijiki::DcmgrResource::V1203::InstanceMethods
  end
end