## Orderly SDK demo site

### Docker

For deployment we use Docker. The image can be built and run via:

```shell
docker build -t <tag> .
docker run --rm -p <port>:80 <tag>
```
