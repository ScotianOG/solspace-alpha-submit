/**
 * Netlify Plugin to handle Prisma Client generation
 */
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      console.log('Generating Prisma Client...');
      await utils.run.command('npx prisma generate');
      console.log('Prisma Client generated successfully.');
    } catch (error) {
      console.error('Error generating Prisma Client:', error);
      utils.build.failBuild('Prisma generation failed, see error above');
    }
  }
};
