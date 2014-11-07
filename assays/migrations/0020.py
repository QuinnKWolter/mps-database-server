# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'AssayChipReadoutAssay'
        db.create_table(u'assays_assaychipreadoutassay', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('readout_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['assays.AssayChipReadout'])),
            ('assay_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['assays.AssayModel'], null=True)),
            ('reader_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['assays.AssayReader'])),
            ('object_type', self.gf('django.db.models.fields.CharField')(default='F', max_length=6)),
            ('readout_unit', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['assays.ReadoutUnit'])),
        ))
        db.send_create_signal(u'assays', ['AssayChipReadoutAssay'])

        # Adding unique constraint on 'AssayChipReadoutAssay', fields ['readout_id', 'assay_id']
        db.create_unique(u'assays_assaychipreadoutassay', ['readout_id_id', 'assay_id_id'])


        # Changing field 'AssayChipCells.cell_biosensor'
        db.alter_column(u'assays_assaychipcells', 'cell_biosensor_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['cellsamples.Biosensor'], null=True))
        # Deleting field 'AssayChipReadout.assay_run_id'
        db.delete_column(u'assays_assaychipreadout', 'assay_run_id_id')

        # Deleting field 'AssayChipReadout.reader_name'
        db.delete_column(u'assays_assaychipreadout', 'reader_name_id')

        # Deleting field 'AssayChipReadout.assay_name'
        db.delete_column(u'assays_assaychipreadout', 'assay_name_id')

        # Deleting field 'AssayChipReadout.readout_unit'
        db.delete_column(u'assays_assaychipreadout', 'readout_unit_id')

        # Adding field 'AssayChipRawData.assay_id'
        db.add_column(u'assays_assaychiprawdata', 'assay_id',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=2, to=orm['assays.AssayChipReadoutAssay']),
                      keep_default=False)

        # Adding unique constraint on 'AssayChipRawData', fields ['assay_chip_id', 'assay_id', 'field_id', 'elapsed_time']
        db.create_unique(u'assays_assaychiprawdata', ['assay_chip_id_id', 'assay_id_id', 'field_id', 'elapsed_time'])


    def backwards(self, orm):
        # Removing unique constraint on 'AssayChipRawData', fields ['assay_chip_id', 'assay_id', 'field_id', 'elapsed_time']
        db.delete_unique(u'assays_assaychiprawdata', ['assay_chip_id_id', 'assay_id_id', 'field_id', 'elapsed_time'])

        # Removing unique constraint on 'AssayChipReadoutAssay', fields ['readout_id', 'assay_id']
        db.delete_unique(u'assays_assaychipreadoutassay', ['readout_id_id', 'assay_id_id'])

        # Deleting model 'AssayChipReadoutAssay'
        db.delete_table(u'assays_assaychipreadoutassay')


        # Changing field 'AssayChipCells.cell_biosensor'
        db.alter_column(u'assays_assaychipcells', 'cell_biosensor_id', self.gf('django.db.models.fields.related.ForeignKey')(default=2, to=orm['cellsamples.Biosensor']))
        # Adding field 'AssayChipReadout.assay_run_id'
        db.add_column(u'assays_assaychipreadout', 'assay_run_id',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=2, to=orm['assays.AssayRun']),
                      keep_default=False)

        # Adding field 'AssayChipReadout.reader_name'
        db.add_column(u'assays_assaychipreadout', 'reader_name',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=2, to=orm['assays.AssayReader']),
                      keep_default=False)

        # Adding field 'AssayChipReadout.assay_name'
        db.add_column(u'assays_assaychipreadout', 'assay_name',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['assays.AssayModel'], null=True),
                      keep_default=False)

        # Adding field 'AssayChipReadout.readout_unit'
        db.add_column(u'assays_assaychipreadout', 'readout_unit',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=2, to=orm['assays.ReadoutUnit']),
                      keep_default=False)

        # Deleting field 'AssayChipRawData.assay_id'
        db.delete_column(u'assays_assaychiprawdata', 'assay_id_id')


    models = {
        u'assays.assaybaselayout': {
            'Meta': {'ordering': "('base_layout_name',)", 'object_name': 'AssayBaseLayout'},
            'base_layout_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaybaselayout_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'layout_format': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayLayoutFormat']"}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaybaselayout_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaybaselayout_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assaychipcells': {
            'Meta': {'object_name': 'AssayChipCells'},
            'assay_chip': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipSetup']", 'null': 'True', 'blank': 'True'}),
            'cell_biosensor': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Biosensor']", 'null': 'True', 'blank': 'True'}),
            'cell_passage': ('django.db.models.fields.CharField', [], {'default': "'-'", 'max_length': '16'}),
            'cell_sample': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellSample']"}),
            'cellsample_density': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'cellsample_density_unit': ('django.db.models.fields.CharField', [], {'default': "'CP'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'assays.assaychiprawdata': {
            'Meta': {'unique_together': "[('assay_chip_id', 'assay_id', 'field_id', 'elapsed_time')]", 'object_name': 'AssayChipRawData'},
            'assay_chip_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipReadout']"}),
            'assay_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipReadoutAssay']"}),
            'elapsed_time': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'field_id': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.FloatField', [], {'null': 'True'})
        },
        u'assays.assaychipreadout': {
            'Meta': {'ordering': "('chip_setup',)", 'object_name': 'AssayChipReadout'},
            'assay_start_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'chip_setup': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipSetup']", 'null': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipreadout_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipreadout_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'notebook': ('django.db.models.fields.CharField', [], {'max_length': '256', 'null': 'True', 'blank': 'True'}),
            'notebook_page': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'notes': ('django.db.models.fields.CharField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'readout_start_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'scientist': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipreadout_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'timeunit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.TimeUnits']"}),
            'treatment_time_length': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '13'})
        },
        u'assays.assaychipreadoutassay': {
            'Meta': {'unique_together': "[('readout_id', 'assay_id')]", 'object_name': 'AssayChipReadoutAssay'},
            'assay_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayModel']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'object_type': ('django.db.models.fields.CharField', [], {'default': "'F'", 'max_length': '6'}),
            'reader_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayReader']"}),
            'readout_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipReadout']"}),
            'readout_unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.ReadoutUnit']"})
        },
        u'assays.assaychipsetup': {
            'Meta': {'ordering': "('assay_run_id', 'assay_chip_id')", 'object_name': 'AssayChipSetup'},
            'assay_chip_id': ('django.db.models.fields.CharField', [], {'max_length': '512'}),
            'assay_run_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayRun']"}),
            'chip_test_type': ('django.db.models.fields.CharField', [], {'max_length': '8'}),
            'compound': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['compounds.Compound']", 'null': 'True', 'blank': 'True'}),
            'concentration': ('django.db.models.fields.FloatField', [], {'default': '0', 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipsetup_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.OrganModel']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipsetup_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'notebook': ('django.db.models.fields.CharField', [], {'max_length': '256', 'null': 'True', 'blank': 'True'}),
            'notebook_page': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'notes': ('django.db.models.fields.CharField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'scientist': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaychipsetup_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '13'}),
            'unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.PhysicalUnits']", 'null': 'True', 'blank': 'True'})
        },
        u'assays.assaycompound': {
            'Meta': {'object_name': 'AssayCompound'},
            'assay_layout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayLayout']"}),
            'column': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'compound': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['compounds.Compound']"}),
            'concentration': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'concentration_unit': ('django.db.models.fields.CharField', [], {'default': "'\\xce\\xbcM'", 'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'row': ('django.db.models.fields.CharField', [], {'max_length': '25'})
        },
        u'assays.assaydevicereadout': {
            'Meta': {'ordering': "('assay_device_id', 'assay_name')", 'object_name': 'AssayDeviceReadout'},
            'assay_device_id': ('django.db.models.fields.CharField', [], {'max_length': '512'}),
            'assay_layout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayLayout']"}),
            'assay_name': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayModel']", 'null': 'True'}),
            'assay_start_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'cell_sample': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellSample']"}),
            'cellsample_density': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'cellsample_density_unit': ('django.db.models.fields.CharField', [], {'default': "'ML'", 'max_length': '8'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaydevicereadout_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaydevicereadout_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'notebook': ('django.db.models.fields.CharField', [], {'max_length': '256', 'null': 'True', 'blank': 'True'}),
            'notebook_page': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'notes': ('django.db.models.fields.CharField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'reader_name': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayReader']"}),
            'readout_start_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'readout_unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.ReadoutUnit']"}),
            'scientist': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaydevicereadout_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'timeunit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.TimeUnits']"}),
            'treatment_time_length': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assaylayout': {
            'Meta': {'ordering': "('layout_name',)", 'object_name': 'AssayLayout'},
            'base_layout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayBaseLayout']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayout_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'layout_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayout_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayout_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assaylayoutformat': {
            'Meta': {'ordering': "('layout_format_name',)", 'object_name': 'AssayLayoutFormat'},
            'column_labels': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayoutformat_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.Microdevice']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'layout_format_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayoutformat_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'number_of_columns': ('django.db.models.fields.IntegerField', [], {}),
            'number_of_rows': ('django.db.models.fields.IntegerField', [], {}),
            'row_labels': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaylayoutformat_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assaymodel': {
            'Meta': {'ordering': "('assay_name',)", 'object_name': 'AssayModel'},
            'assay_description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'assay_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'assay_protocol_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'assay_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayModelType']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodel_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodel_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodel_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'version_number': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        u'assays.assaymodeltype': {
            'Meta': {'ordering': "('assay_type_name',)", 'object_name': 'AssayModelType'},
            'assay_type_description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'assay_type_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodeltype_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodeltype_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaymodeltype_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assayplatetestresult': {
            'Meta': {'object_name': 'AssayPlateTestResult'},
            'assay_device_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayDeviceReadout']"}),
            'assay_test_time': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayplatetestresult_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayplatetestresult_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'result': ('django.db.models.fields.CharField', [], {'default': "'1'", 'max_length': '8'}),
            'severity': ('django.db.models.fields.CharField', [], {'default': "'-1'", 'max_length': '5', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayplatetestresult_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'time_units': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.TimeUnits']", 'null': 'True', 'blank': 'True'}),
            'value': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'value_units': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.PhysicalUnits']", 'null': 'True', 'blank': 'True'})
        },
        u'assays.assayreader': {
            'Meta': {'ordering': "('reader_name',)", 'object_name': 'AssayReader'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayreader_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayreader_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'reader_name': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'reader_type': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayreader_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assayreadout': {
            'Meta': {'object_name': 'AssayReadout'},
            'assay_device_readout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayDeviceReadout']"}),
            'column': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'elapsed_time': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'row': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'value': ('django.db.models.fields.FloatField', [], {})
        },
        u'assays.assayresult': {
            'Meta': {'object_name': 'AssayResult'},
            'assay_name': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayChipReadout']"}),
            'assay_result': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayTestResult']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'result': ('django.db.models.fields.CharField', [], {'default': "'1'", 'max_length': '8'}),
            'result_function': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayResultFunction']", 'null': 'True', 'blank': 'True'}),
            'result_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayResultType']", 'null': 'True', 'blank': 'True'}),
            'severity': ('django.db.models.fields.CharField', [], {'default': "'-1'", 'max_length': '5', 'null': 'True', 'blank': 'True'}),
            'test_unit': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.PhysicalUnits']", 'null': 'True', 'blank': 'True'}),
            'value': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assayresultfunction': {
            'Meta': {'ordering': "('function_name',)", 'object_name': 'AssayResultFunction'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresultfunction_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'function_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'function_results': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresultfunction_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresultfunction_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assayresulttype': {
            'Meta': {'ordering': "('assay_result_type',)", 'object_name': 'AssayResultType'},
            'assay_result_type': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresulttype_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresulttype_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayresulttype_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assayrun': {
            'Meta': {'ordering': "('assay_run_id',)", 'object_name': 'AssayRun'},
            'assay_run_id': ('django.db.models.fields.TextField', [], {'unique': 'True'}),
            'center_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.MicrophysiologyCenter']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayrun_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayrun_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {'default': "'Study01'"}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assayrun_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'start_date': ('django.db.models.fields.DateTimeField', [], {}),
            'type1': ('django.db.models.fields.CharField', [], {'default': "'TOX'", 'max_length': '13'}),
            'type2': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'}),
            'type3': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'})
        },
        u'assays.assaytestresult': {
            'Meta': {'object_name': 'AssayTestResult'},
            'assay_device_readout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayRun']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaytestresult_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaytestresult_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaytestresult_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.assaytimepoint': {
            'Meta': {'object_name': 'AssayTimepoint'},
            'assay_layout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayLayout']"}),
            'column': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'row': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'timepoint': ('django.db.models.fields.FloatField', [], {'default': '0'})
        },
        u'assays.assaywell': {
            'Meta': {'unique_together': "[('base_layout', 'row', 'column')]", 'object_name': 'AssayWell'},
            'base_layout': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayBaseLayout']"}),
            'column': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywell_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywell_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'row': ('django.db.models.fields.CharField', [], {'max_length': '25'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywell_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'well_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['assays.AssayWellType']"})
        },
        u'assays.assaywelltype': {
            'Meta': {'ordering': "('well_type',)", 'object_name': 'AssayWellType'},
            'background_color': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywelltype_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywelltype_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'assaywelltype_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'well_description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'well_type': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'assays.physicalunits': {
            'Meta': {'ordering': "['unit_type', 'unit']", 'object_name': 'PhysicalUnits'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'physicalunits_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '256', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'physicalunits_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'physicalunits_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'unit': ('django.db.models.fields.CharField', [], {'max_length': '256'}),
            'unit_type': ('django.db.models.fields.CharField', [], {'default': "'C'", 'max_length': '2'})
        },
        u'assays.readoutunit': {
            'Meta': {'ordering': "('readout_unit',)", 'object_name': 'ReadoutUnit'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'readoutunit_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '512', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'readoutunit_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'readout_unit': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '512'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'readoutunit_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'assays.timeunits': {
            'Meta': {'ordering': "['unit_order']", 'object_name': 'TimeUnits'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'timeunits_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '256', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'timeunits_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'timeunits_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'unit': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            'unit_order': ('django.db.models.fields.FloatField', [], {'default': '0'})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'cellsamples.biosensor': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Biosensor'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'biosensor_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '512', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'lot_number': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'biosensor_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'product_id': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'biosensor_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'supplier': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Supplier']"})
        },
        u'cellsamples.cellsample': {
            'Meta': {'ordering': "('cell_type', 'cell_source', 'supplier', 'barcode', 'id')", 'object_name': 'CellSample'},
            'barcode': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'cell_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'cell_source': ('django.db.models.fields.CharField', [], {'default': "'Primary'", 'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'cell_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellType']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsample_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isolation_datetime': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'isolation_method': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'isolation_notes': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsample_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'patient_age': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'patient_condition': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'patient_gender': ('django.db.models.fields.CharField', [], {'default': "'N'", 'max_length': '1', 'blank': 'True'}),
            'percent_viability': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'product_id': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'receipt_date': ('django.db.models.fields.DateField', [], {}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsample_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'supplier': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Supplier']"}),
            'viable_count': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'viable_count_unit': ('django.db.models.fields.CharField', [], {'default': "'N'", 'max_length': '1', 'blank': 'True'})
        },
        u'cellsamples.cellsubtype': {
            'Meta': {'ordering': "('cell_subtype',)", 'object_name': 'CellSubtype'},
            'cell_subtype': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsubtype_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsubtype_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsubtype_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'cellsamples.celltype': {
            'Meta': {'ordering': "('species', 'cell_type', 'cell_subtype')", 'unique_together': "[('cell_type', 'species', 'cell_subtype')]", 'object_name': 'CellType'},
            'cell_subtype': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellSubtype']"}),
            'cell_type': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'celltype_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'celltype_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'organ': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Organ']"}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'celltype_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'species': ('django.db.models.fields.CharField', [], {'default': "'Human'", 'max_length': '10', 'null': 'True', 'blank': 'True'})
        },
        u'cellsamples.organ': {
            'Meta': {'ordering': "('organ_name',)", 'object_name': 'Organ'},
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organ_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organ_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'organ_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organ_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'cellsamples.supplier': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Supplier'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'supplier_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'supplier_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'supplier_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'compounds.compound': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Compound'},
            'acidic_pka': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'alogp': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'basic_pka': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'chemblid': ('django.db.models.fields.CharField', [], {'max_length': '20', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'compound_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'inchikey': ('django.db.models.fields.CharField', [], {'max_length': '27', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'known_drug': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_update': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'logd': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'logp': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'medchem_friendly': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'compound_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'molecular_formula': ('django.db.models.fields.CharField', [], {'max_length': '40', 'null': 'True', 'blank': 'True'}),
            'molecular_weight': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'ro3_passes': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'ro5_violations': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'rotatable_bonds': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'compound_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'smiles': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
            'species': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'synonyms': ('django.db.models.fields.TextField', [], {'max_length': '4000', 'null': 'True', 'blank': 'True'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'microdevices.manufacturer': {
            'Manufacturer_website': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'Meta': {'ordering': "('manufacturer_name',)", 'object_name': 'Manufacturer'},
            'contact_person': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'manufacturer_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'manufacturer_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'manufacturer_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'manufacturer_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'microdevices.microdevice': {
            'Meta': {'ordering': "('device_name', 'organ')", 'object_name': 'Microdevice'},
            'barcode': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'center': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.MicrophysiologyCenter']", 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microdevice_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'device_cross_section_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'device_fluid_volume': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'device_fluid_volume_unit': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'device_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'device_length': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'device_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'device_size_unit': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'device_thickness': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'device_width': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'manufacturer': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.Manufacturer']", 'null': 'True', 'blank': 'True'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microdevice_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'organ': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Organ']", 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microdevice_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'substrate_material': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'substrate_thickness': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'})
        },
        u'microdevices.microphysiologycenter': {
            'Meta': {'ordering': "('center_name',)", 'object_name': 'MicrophysiologyCenter'},
            'center_id': ('django.db.models.fields.CharField', [], {'default': "'-'", 'max_length': '20'}),
            'center_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'center_website': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'contact_person': ('django.db.models.fields.CharField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microphysiologycenter_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microphysiologycenter_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'microphysiologycenter_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        u'microdevices.organmodel': {
            'Meta': {'ordering': "('model_name', 'organ')", 'object_name': 'OrganModel'},
            'cell_type': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'organmodels'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['cellsamples.CellType']"}),
            'center': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.MicrophysiologyCenter']", 'null': 'True', 'blank': 'True'}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organmodel_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '400', 'null': 'True', 'blank': 'True'}),
            'device': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['microdevices.Microdevice']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'model_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'modified_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organmodel_modified-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'modified_on': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'organ': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Organ']"}),
            'signed_off_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'organmodel_signed_off_by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'signed_off_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['assays']