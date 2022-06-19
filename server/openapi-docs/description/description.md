# Introduction

A key feature of Auth0 is to permit the Auth0 authorization server to proxy logins to external sources of users. This project is intended as an example of a custom DB connection into an Auth0. This page documents the RESTful API endpoints for that custom DB connection.

## Source Code

This project is intended for use only as an example of how to connect Auth0 to an externally managed custom database. The <a href="https://github.com/WolbachAuth0/external-users-db">source code</a> is available for Okta employees. It is not intended to represent production ready code.

# Authentication

This API makes use of two types of authentication. The Basic Auth authentication scheme is used ONLY for the Login User endpoint. For all other endpoints, a bearer token (as a JWT) is appended in the authorization header.