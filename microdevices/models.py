# coding=utf-8

from django.db import models
from django.contrib.auth.models import Group

from mps.base.models import LockableModel


class MicrophysiologyCenter(LockableModel):
    class Meta(object):
        ordering = ('center_name', )

    center_name = models.CharField(max_length=100)
    center_id = models.CharField(max_length=20, default='-')
    description = models.CharField(max_length=400, blank=True, null=True)
    contact_person = models.CharField(max_length=250, blank=True, null=True)
    center_website = models.URLField(blank=True, null=True)

    groups = models.ManyToManyField(Group)

    def __unicode__(self):
        return self.center_name


class Manufacturer(LockableModel):
    class Meta(object):
        ordering = ('manufacturer_name', )

    manufacturer_name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=250, blank=True, null=True)
    Manufacturer_website = models.URLField(blank=True, null=True)

    def __unicode__(self):
        return self.manufacturer_name


class Microdevice(LockableModel):
    class Meta(object):
        ordering = ('device_name', 'organ', )

    device_name = models.CharField(max_length=200)

    organ = models.ForeignKey('cellsamples.Organ', blank=True, null=True)
    center = models.ForeignKey(MicrophysiologyCenter, blank=True, null=True)
    manufacturer = models.ForeignKey(Manufacturer, null=True, blank=True)
    barcode = models.CharField(
        max_length=200, verbose_name='version/ catalog#', null=True, blank=True)

    description = models.CharField(max_length=400, null=True, blank=True)

    device_width = models.FloatField(
        verbose_name='width (mm)', null=True, blank=True)
    device_length = models.FloatField(
        verbose_name='length (mm)', null=True, blank=True)
    device_thickness = models.FloatField(
        verbose_name='thickness (mm)', null=True, blank=True)
    device_size_unit = models.CharField(max_length=50, null=True, blank=True)

    device_image = models.ImageField(upload_to='assays', null=True, blank=True)
    device_cross_section_image = models.ImageField(
        upload_to='assays', null=True, blank=True)

    device_fluid_volume = models.FloatField(null=True, blank=True)
    device_fluid_volume_unit = models.CharField(
        max_length=50, null=True, blank=True)

    substrate_thickness = models.FloatField(
        verbose_name='substrate thickness (um)', null=True, blank=True)
    substrate_material = models.CharField(
        max_length=150, null=True, blank=True)

    # Specify whether the device is a plate or a chip
    device_type = models.CharField(max_length=8,
                                   choices=(('chip', 'Microchip'),
                                            ('plate', 'Plate')))

    # Optional fields primarily intended for plates
    # (though certain chips appear in a series)
    number_of_rows = models.IntegerField(blank=True, null=True)
    number_of_columns = models.IntegerField(blank=True, null=True)
    row_labels = models.CharField(blank=True,
                                  null=True,
                                  max_length=1000,
                                  help_text=
                                  'Space separated list of unique labels, '
                                  'e.g. "A B C D ..."'
                                  ' Number of items must match'
                                  ' number of columns.''')
    column_labels = models.CharField(blank=True,
                                     null=True,
                                     max_length=1000,
                                     help_text='Space separated list of unique '
                                               'labels, e.g. "1 2 3 4 ...". '
                                               'Number of items must match '
                                               'number of columns.')

    def __unicode__(self):
        return self.device_name

    def get_absolute_url(self):
        return "/microdevices/device/{}".format(self.id)


class OrganModel(LockableModel):
    class Meta(object):
        verbose_name = 'Organ Model'
        ordering = ('model_name', 'organ', )

    model_name = models.CharField(max_length=200)
    organ = models.ForeignKey('cellsamples.Organ')
    center = models.ForeignKey(MicrophysiologyCenter, null=True, blank=True)
    device = models.ForeignKey(Microdevice)
    description = models.CharField(max_length=400, null=True, blank=True)

    # Removed in favor of protocol inline
    #protocol = models.FileField(upload_to='protocols', verbose_name='Protocol File',
    #                        blank=True, null=True, help_text='File detailing the protocols for this model')

    def __unicode__(self):
        return self.model_name

    def get_absolute_url(self):
        return "/microdevices/model/{}".format(self.id)


# It is somewhat odd that ValidatedAssays are inlines in lieu of a manytomany field
# This was done originally so that additional fields could be added to a validated assay
# If no new fields become apparent, it may be worthwhile to do away with inlines and move to M2M
class ValidatedAssay(models.Model):
    # Validated assays for an organ model used in inline
    organ_model = models.ForeignKey(OrganModel, verbose_name='Organ Model')
    assay = models.ForeignKey('assays.AssayModel', verbose_name='Assay Model')


class OrganModelProtocol(models.Model):
    """
    This model is intended to be an inline
    It contains files for Organ Model Protocols and designates their version
    """
    organ_model = models.ForeignKey(OrganModel, verbose_name='Organ Model')
    version = models.CharField(max_length=20)
    protocol = models.FileField(upload_to='protocols', verbose_name='Protocol File')

    def __unicode__(self):
        return self.version
