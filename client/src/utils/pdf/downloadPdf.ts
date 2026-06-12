import { ResumeView } from '../../types/resume';
import { buildDocDefinition } from './buildDocDefinition';

/**
 * Lazily imports pdfmake (~1MB with embedded Roboto fonts) only when the
 * user actually clicks Download. Webpack emits these as separate chunks.
 *
 * Written against pdfmake 0.3.x, where:
 *   - the API is module-level functions (createPdf, addVirtualFileSystem)
 *   - vfs_fonts exports the font dictionary directly (CommonJS `export =`)
 */
export const downloadResumePdf = async (view: ResumeView): Promise<void> => {
  const [pdfMake, vfs] = await Promise.all([
    import(/* webpackChunkName: "pdfmake" */ 'pdfmake/build/pdfmake'),
    import(/* webpackChunkName: "pdfmake-fonts" */ 'pdfmake/build/vfs_fonts'),
  ]);

  pdfMake.addVirtualFileSystem(vfs.default);

  const sanitize = (s: string): string => s.replace(/[^\w]+/g, '_').replace(/^_|_$/g, '');
  const safeName = view.profile.name.replace(/\s+/g, '_');
  const fileName = `${safeName}_${view.roleLabel.replace(/\s+/g, '')}_Resume.pdf`;

  pdfMake.createPdf(buildDocDefinition(view)).download(fileName);
};