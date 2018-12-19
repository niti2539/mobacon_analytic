pscp -i mobacon.ppk -r server pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk -r shared pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk -r src pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk docker-compose.yml pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk .dockerignore pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk Dockerfile pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk package.json pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk package-lock.json pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk server.ts pok@128.199.204.164:/srv/mobacon/mobacon-analytic
pscp -i mobacon.ppk tsconfig.json pok@128.199.204.164:/srv/mobacon/mobacon-analytic