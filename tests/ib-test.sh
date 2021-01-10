#!/bin/bash
# Copyright 2021 Sendanor <info@sendanor.fi>
#
# System test for inventory-backend and ib command
#
# You may change the inventory domain and URL using IB_DOMAIN and IB_URL.
#

set -x 
set -e

ib create                                              # Create default inventory domain
test "x$(ib list|wc -l|tr -d '\t \n')" = x0            # Assure we don't have any items

ib set foo1 hostname=foo1.example.com                                # Set first item
test "x$(ib list|wc -l|tr -d '\t \n')" = x1                          # Assure we have one item now
test "x$(ib list)" = "$(printf 'xfoo1\thostname=foo1.example.com')"  # Assure 'ib list' works

ib foo1|grep -qFx 'hostname=foo1.example.com'          # Assure that 'ib foo1' works
ib get foo1|grep -qFx 'hostname=foo1.example.com'      # Assure that 'ib get foo1' works
test "x$(ib get foo1 hostname)" = xfoo1.example.com    # Assure that 'ib get foo1 hostname' works

ib set bar2 hostname=bar2.example.com                                                                 # Set second item
test "x$(ib list|wc -l|tr -d '\t \n')" = x2                                                           # Assure we have two items now
test "x$(ib list)" = "$(printf 'xfoo1\thostname=foo1.example.com\nbar2\thostname=bar2.example.com')"  # Assure 'ib list' works

ib bar2|grep -qFx 'hostname=bar2.example.com'          # Assure that 'ib bar2' works
ib get bar2|grep -qFx 'hostname=bar2.example.com'      # Assure that 'ib get bar2' works
test "x$(ib get bar2 hostname)" = xbar2.example.com    # Assure that 'ib get bar2 hostname' works

ib foo1|grep -qFx 'hostname=foo1.example.com'          # Assure that 'ib foo1' still works
ib get foo1|grep -qFx 'hostname=foo1.example.com'      # Assure that 'ib get foo1' still works
test "x$(ib get foo1 hostname)" = xfoo1.example.com    # Assure that 'ib get foo1 hostname' still works

ib set bar2 hostname=bar.example.com                   # Update second item
test "x$(ib list|wc -l|tr -d '\t \n')" = x2            # Assure we have two items still

ib bar2|grep -qFx 'hostname=bar.example.com'           # Assure that 'ib bar2' works
ib get bar2|grep -qFx 'hostname=bar.example.com'       # Assure that 'ib get bar2' works
test "x$(ib get bar2 hostname)" = xbar.example.com     # Assure that 'ib get bar2 hostname' works

ib foo1|grep -qFx 'hostname=foo1.example.com'          # Assure that 'ib foo1' still works
ib get foo1|grep -qFx 'hostname=foo1.example.com'      # Assure that 'ib get foo1' still works
test "x$(ib get foo1 hostname)" = xfoo1.example.com    # Assure that 'ib get foo1 hostname' still works

test "x$(ib delete bar2)" = xtrue                      # Delete bar2
test "x$(ib list|wc -l|tr -d '\t \n')" = x1            # Assure we have one item now

test "x$(ib delete bar2)" = xfalse                     # Delete bar2 again
test "x$(ib list|wc -l|tr -d '\t \n')" = x1            # Assure we have one item still

ib foo1|grep -qFx 'hostname=foo1.example.com'          # Assure that 'ib foo1' still works
ib get foo1|grep -qFx 'hostname=foo1.example.com'      # Assure that 'ib get foo1' still works
test "x$(ib get foo1 hostname)" = xfoo1.example.com    # Assure that 'ib get foo1 hostname' still works

# Clean up

test "x$(ib delete foo1)" = xtrue                      # Delete foo1 also
test "x$(ib list|wc -l|tr -d '\t \n')" = x0            # Assure we don't have any items left

# FIXME: Implement support to delete domain

echo 'OK'
