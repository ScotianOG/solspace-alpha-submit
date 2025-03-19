/**
 * Netlify Plugin to handle Prisma Client generation during build
 */
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      // First, run the script to modify the Prisma schema for build
      console.log('Setting up Prisma for build...');
      await utils.run.command('node ./netlify/build-scripts/setup-prisma-for-build.cjs');
      
      // Then generate the Prisma client
      console.log('Generating Prisma Client...');
      await utils.run.command('npx prisma generate');
      
      console.log('Prisma Client generated successfully.');
    } catch (error) {
      console.error('Error in Prisma setup or generation:', error);
      utils.build.failBuild('Prisma setup or generation failed, see error above');
    }
  }
};
