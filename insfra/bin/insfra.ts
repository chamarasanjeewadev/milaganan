#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InsfraStack } from '../lib/insfra-stack';

const app = new cdk.App();
new InsfraStack(app, 'InsfraStack');