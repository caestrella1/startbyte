import React, { useState, useEffect } from 'react';
import SettingsPanel from 'components/settings/SettingsPanel';
import SettingSection from 'components/settings/SettingSection';
import BackgroundSection from 'components/settings/BackgroundSection';
import GridSection from 'components/settings/GridSection';
import ResetSection from 'components/settings/ResetSection';

export default function Settings({ 
  isOpen, 
  onClose, 
  background, 
  customBackgroundImage, 
  backgroundType, 
  customSolidColor, 
  customGradientColors, 
  backgroundBlur, 
  backgroundOverlay, 
  onBackgroundChange, 
  onCustomBackgroundChange, 
  onBackgroundTypeChange, 
  onCustomSolidColorChange, 
  onCustomGradientColorsChange, 
  onBackgroundBlurChange, 
  onBackgroundOverlayChange, 
  gridColumnsSmall,
  onGridColumnsSmallChange,
  gridColumnsMedium,
  onGridColumnsMediumChange,
  gridColumnsLarge,
  onGridColumnsLargeChange,
  widgetAlignmentHorizontal,
  onWidgetAlignmentHorizontalChange,
  widgetAlignmentVertical,
  onWidgetAlignmentVerticalChange,
  onResetBackground, 
  onResetAll, 
  onExportSettings, 
  onImportSettings 
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setCurrentCategory(null);
    }
  }, [isOpen]);

  const handleCategorySelect = (categoryId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategory(categoryId);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategory(null);
      setIsTransitioning(false);
    }, 150);
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleFinishClose = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  return (
    <SettingsPanel
      isOpen={isOpen}
      isClosing={isClosing}
      currentCategory={currentCategory}
      isTransitioning={isTransitioning}
      onClose={handleClose}
      onFinishClose={handleFinishClose}
      onCategorySelect={handleCategorySelect}
      onBack={handleBack}
    >
      <SettingSection
        categoryId="background"
        currentCategory={currentCategory}
        isTransitioning={isTransitioning}
      >
        <BackgroundSection
          background={background}
          backgroundType={backgroundType}
          customSolidColor={customSolidColor}
          customGradientColors={customGradientColors}
          customBackgroundImage={customBackgroundImage}
          backgroundBlur={backgroundBlur}
          backgroundOverlay={backgroundOverlay}
          onBackgroundChange={onBackgroundChange}
          onBackgroundTypeChange={onBackgroundTypeChange}
          onCustomSolidColorChange={onCustomSolidColorChange}
          onCustomGradientColorsChange={onCustomGradientColorsChange}
          onCustomBackgroundChange={onCustomBackgroundChange}
          onBackgroundBlurChange={onBackgroundBlurChange}
          onBackgroundOverlayChange={onBackgroundOverlayChange}
        />
      </SettingSection>

      <SettingSection
        categoryId="grid"
        currentCategory={currentCategory}
        isTransitioning={isTransitioning}
      >
        <GridSection
          gridColumnsSmall={gridColumnsSmall}
          onGridColumnsSmallChange={onGridColumnsSmallChange}
          gridColumnsMedium={gridColumnsMedium}
          onGridColumnsMediumChange={onGridColumnsMediumChange}
          gridColumnsLarge={gridColumnsLarge}
          onGridColumnsLargeChange={onGridColumnsLargeChange}
          widgetAlignmentHorizontal={widgetAlignmentHorizontal}
          onWidgetAlignmentHorizontalChange={onWidgetAlignmentHorizontalChange}
          widgetAlignmentVertical={widgetAlignmentVertical}
          onWidgetAlignmentVerticalChange={onWidgetAlignmentVerticalChange}
        />
      </SettingSection>

      <SettingSection
        categoryId="reset"
        currentCategory={currentCategory}
        isTransitioning={isTransitioning}
      >
        <ResetSection
          onExportSettings={onExportSettings}
          onImportSettings={onImportSettings}
          onResetBackground={onResetBackground}
          onResetAll={onResetAll}
          onBack={handleBack}
        />
      </SettingSection>
    </SettingsPanel>
  );
}

