react-app-rewired build

# Wait for the build to finish
wait

# Delete the old build folder inside ../Installation_package_shared
rm -rf ../Installation_package_shared/build

# Move the new build folder to ../Installation_package_shared
mv ./build ../Installation_package_shared/build

