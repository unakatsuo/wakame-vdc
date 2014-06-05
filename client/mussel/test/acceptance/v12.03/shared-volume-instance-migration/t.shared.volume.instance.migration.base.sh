#!/bin/bash
#
#
#
#

## include files

. ${BASH_SOURCE[0]%/*}/helper_shunit2.sh
. ${BASH_SOURCE[0]%/*}/helper_instance.sh

## variables
launch_host_node=${launch_host_node:-dsv0003}
migration_host_node=${migration_host_node:-dsv0005}

## hook functions

last_result_path=""

function setUp() {
  last_result_path=$(mktemp --tmpdir=${SHUNIT_TMPDIR})

  # reset command parameters
  volumes_args=
}

### step

# API test for shared volume instance migration.
#
# 1.  boot shared volume instance.
# 2.  migration the instance.
# 3.  check the process.
# 4.  poweroff the instance.
# 5.  poweron the instance.
# 6.  attach volume to instance.
# 7.  check the attach second volume.
# 8.  detach volume to instance.
# 9.  check the detach second volume.
# 10. terminate the instance.
function test_migration_shared_volume_instance(){
  # boot shared volume instance.
  local host_node_id=${launch_host_node}
  create_instance

  # migration the instance.
  host_node_id=${migration_host_node} run_cmd instance move ${instance_uuid} >/dev/null
  retry_until "document_pair? instance ${instance_uuid} state running"
  assertEquals 0 $?

  # check the process.

  # poweroff the instance.
  run_cmd instance poweroff ${instance_uuid} >/dev/null
  retry_until "document_pair? instance ${instance_uuid} state halted"
  assertEquals 0 $?

  # poweron the instance.
  run_cmd instance poweron ${instance_uuid} >/dev/null
  assertNotEquals 0 $?

  # attach volume to instance.

  # check the attach second volume.

  # detach volume to instance

  # check the detach second volume.

  # terminate the instance.
  run_cmd instance destroy ${instance_uuid} >/dev/null
  assertEquals 0 $?
}

# API test for shared volume instance with second blank volume migration.
#
# 1. boot shared volume instance with second blank volume.
# 2. migration the instance.
# 3. check the process.
# 4. check the second blank disk.
# 5. poweroff the instance.
# 6. poweron the instance.
# 7. terminate the instance.
#function test_migration_shared_volume_instance_with_second_blank_volume(){
#}

## shunit2

. ${shunit2_file}

