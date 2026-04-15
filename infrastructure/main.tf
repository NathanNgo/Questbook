terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = "ap-southeast-2"
}

resource "aws_s3_bucket" "test_bucket" {
    bucket = "test-bucket-c20aa76f-e34a-4d25-b0ed-72eecd026504"

    tags = {
        Name = "Test Bucket"
        Environment = "Dev"
    }
}