# -*- coding: utf-8 -*-

module Mussel
  class Instance < Base
    @mussel_instance_id = 0
    @ssh_key_pair_path = File.dirname(__FILE__)

    def self.create(params)
      create_ssh_key_pair
      super(params)
      wait_instance
    end

    def self.create_ssh_key_pair
      @mussel_instance_id = @mussel_instance_id + 1
      output_keyfile="#{@ssh_key_pair_path}/key_pair.#{$$}_#{@mussel_instance_id}"
      system("ssh-keygen -N '' -f #{output_keyfile} -C #{output_keyfile}")
      SshKeyPair.create({
        :description => output_keyfile,
        :public_key => "#{output_keyfile}.pub"
      })
    end

    def self.wait_instance
    end
  end
end
