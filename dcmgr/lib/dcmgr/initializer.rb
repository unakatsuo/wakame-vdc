# -*- coding: utf-8 -*-

module Dcmgr
  module Initializer

    def self.included(klass)
      klass.extend(ClassMethods)
    end

    module ClassMethods
      def conf
        @conf
      end
      
      def configure(config_path=nil, &blk)
        return self if @conf
        
        if config_path.is_a?(String)
          raise "Could not find configration file: #{config_path}" unless File.exists?(config_path)
          
          require 'configuration'
          code= <<-__END
            Configuration('global') do
              #{File.read(config_path)}
            end
          __END
          @conf = eval(code)
        else
          @conf = Configuration.for('global', &blk)
        end
        
        self
      end
      
      def run_initializers(*files)
        raise "Complete the configuration prior to run_initializers()." if @conf.nil?
        
        @files ||= []
        if files.length == 0
          @files << "*"
        else
          @files = files
        end
        
        initializer_hooks.each { |n|
          n.call
        }
      end
      
      def initializer_hooks(&blk)
        @initializer_hooks ||= []
        if blk
          @initializer_hooks << blk
        end
        @initializer_hooks
      end
    end
  end
end