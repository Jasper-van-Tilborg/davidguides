'use client'

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { downloadExport, importUserData, validateImportFile } from '@/lib/exportImport'
import { useHabits } from '@/hooks/useHabits'
import { useProgress } from '@/hooks/useProgress'
import { useAchievements } from '@/hooks/useAchievements'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Download, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function ExportImport() {
  const { t } = useTranslation()
  const { refresh: refreshHabits } = useHabits()
  const { refresh: refreshProgress } = useProgress()
  const { refresh: refreshAchievements } = useAchievements()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    imported: { habits: number; checkIns: number; achievements: number }
    errors: string[]
  } | null>(null)
  const [mergeMode, setMergeMode] = useState(true)

  const handleExport = async () => {
    setExporting(true)
    try {
      downloadExport()
      setImportResult({
        success: true,
        imported: { habits: 0, checkIns: 0, achievements: 0 },
        errors: [],
      })
      setTimeout(() => setImportResult(null), 3000)
    } catch (error) {
      setImportResult({
        success: false,
        imported: { habits: 0, checkIns: 0, achievements: 0 },
        errors: [error instanceof Error ? error.message : 'Export failed'],
      })
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const validation = validateImportFile(text)
      
      if (!validation.valid) {
        setImportResult({
          success: false,
          imported: { habits: 0, checkIns: 0, achievements: 0 },
          errors: [validation.error || 'Invalid file'],
        })
        return
      }

      const result = importUserData(text, { merge: mergeMode })
      setImportResult(result)

      if (result.success) {
        // Refresh all data
        refreshHabits()
        refreshProgress()
        refreshAchievements()
      }
    } catch (error) {
      setImportResult({
        success: false,
        imported: { habits: 0, checkIns: 0, achievements: 0 },
        errors: [error instanceof Error ? error.message : 'Import failed'],
      })
    } finally {
      setImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        {t('settings.exportImport') || 'Export / Import'}
      </h2>

      <div className="space-y-6">
        {/* Export Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-adventure-secondary" />
            {t('settings.export') || 'Export Data'}
          </h3>
          <p className="text-sm text-adventure-light/70 mb-4">
            {t('settings.exportDescription') || 'Download all your habits, progress, and achievements as a JSON file.'}
          </p>
          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="secondary"
            className="w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? t('common.loading') : (t('settings.download') || 'Download Export')}
          </Button>
        </div>

        {/* Import Section */}
        <div className="border-t border-adventure-main/20 pt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-adventure-main" />
            {t('settings.import') || 'Import Data'}
          </h3>
          <p className="text-sm text-adventure-light/70 mb-4">
            {t('settings.importDescription') || 'Import habits, progress, and achievements from a JSON file.'}
          </p>

          {/* Merge Mode Toggle */}
          <div className="mb-4 p-3 rounded-lg bg-adventure-dark/50">
            <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={mergeMode}
                onChange={(e) => setMergeMode(e.target.checked)}
                className="w-5 h-5 rounded-lg border-adventure-main/30 bg-adventure-dark text-adventure-main focus:ring-adventure-main"
              />
              <span className="text-sm">
                {t('settings.mergeMode') || 'Merge with existing data (unchecked = replace all)'}
              </span>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="inline-block w-full sm:w-auto"
          >
            <Button
              as="span"
              disabled={importing}
              variant="primary"
              className="w-full sm:w-auto touch-manipulation min-h-[44px] cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? t('common.loading') : (t('settings.selectFile') || 'Select File')}
            </Button>
          </label>
        </div>

        {/* Import Result */}
        {importResult && (
          <div className={`p-4 rounded-xl border-2 ${
            importResult.success
              ? 'bg-adventure-secondary/10 border-adventure-secondary/50'
              : 'bg-red-500/10 border-red-500/50'
          }`}>
            <div className="flex items-start gap-3">
              {importResult.success ? (
                <CheckCircle className="w-5 h-5 text-adventure-secondary flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                {importResult.success ? (
                  <>
                    <p className="font-semibold text-adventure-secondary mb-2">
                      {t('settings.importSuccess') || 'Import Successful!'}
                    </p>
                    <div className="text-sm text-adventure-light/70 space-y-1">
                      {importResult.imported.habits > 0 && (
                        <p>• {importResult.imported.habits} {t('habits.title') || 'habits'}</p>
                      )}
                      {importResult.imported.checkIns > 0 && (
                        <p>• {importResult.imported.checkIns} check-ins</p>
                      )}
                      {importResult.imported.achievements > 0 && (
                        <p>• {importResult.imported.achievements} {t('achievements.title') || 'achievements'}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-400 mb-2">
                      {t('settings.importFailed') || 'Import Failed'}
                    </p>
                    {importResult.errors.length > 0 && (
                      <ul className="text-sm text-adventure-light/70 list-disc list-inside">
                        {importResult.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}


