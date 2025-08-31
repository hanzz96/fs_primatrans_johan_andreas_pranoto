PHP Version 8.4.3 used

copy .env.example to .env

docker-compose up -d


php artisan migrate

php artisan db:seed --class=WorkShiftSeeder

php artisan db:seed --class=EmployeeSeeder

php artisan db:seed --class=AttendanceSeeder
