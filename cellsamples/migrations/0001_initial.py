# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Organ'
        db.create_table(u'cellsamples_organ', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('organ_name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
        ))
        db.send_create_signal(u'cellsamples', ['Organ'])

        # Adding model 'CellType'
        db.create_table(u'cellsamples_celltype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cell_type', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
            ('species', self.gf('django.db.models.fields.CharField')(default='Human', max_length=10, null=True, blank=True)),
            ('cell_subtype', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['cellsamples.CellSubtype'])),
            ('organ', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['cellsamples.Organ'])),
        ))
        db.send_create_signal(u'cellsamples', ['CellType'])

        # Adding model 'CellSubtype'
        db.create_table(u'cellsamples_cellsubtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cell_subtype', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
        ))
        db.send_create_signal(u'cellsamples', ['CellSubtype'])

        # Adding model 'Supplier'
        db.create_table(u'cellsamples_supplier', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
            ('phone', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal(u'cellsamples', ['Supplier'])

        # Adding model 'CellSample'
        db.create_table(u'cellsamples_cellsample', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_by', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='cellsample_created-by', null=True, to=orm['auth.User'])),
            ('created_on', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, null=True, blank=True)),
            ('modified_by', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='cellsample_modified-by', null=True, to=orm['auth.User'])),
            ('modified_on', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('locked', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('cell_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['cellsamples.CellType'])),
            ('cell_source', self.gf('django.db.models.fields.CharField')(default='Primary', max_length=20, null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('receipt_date', self.gf('django.db.models.fields.DateField')()),
            ('supplier', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['cellsamples.Supplier'])),
            ('barcode', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('product_id', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('patient_age', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('patient_gender', self.gf('django.db.models.fields.CharField')(default='N', max_length=1, blank=True)),
            ('patient_condition', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('isolation_datetime', self.gf('django.db.models.fields.DateTimeField')()),
            ('isolation_method', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('isolation_notes', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('viable_count', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('viable_count_unit', self.gf('django.db.models.fields.CharField')(default='N', max_length=1, blank=True)),
            ('percent_viability', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('cell_image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal(u'cellsamples', ['CellSample'])


    def backwards(self, orm):
        # Deleting model 'Organ'
        db.delete_table(u'cellsamples_organ')

        # Deleting model 'CellType'
        db.delete_table(u'cellsamples_celltype')

        # Deleting model 'CellSubtype'
        db.delete_table(u'cellsamples_cellsubtype')

        # Deleting model 'Supplier'
        db.delete_table(u'cellsamples_supplier')

        # Deleting model 'CellSample'
        db.delete_table(u'cellsamples_cellsample')


    models = {
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
        u'cellsamples.cellsample': {
            'Meta': {'object_name': 'CellSample'},
            'barcode': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'cell_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'cell_source': ('django.db.models.fields.CharField', [], {'default': "'Primary'", 'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'cell_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellType']"}),
            'created_by': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cellsample_created-by'", 'null': 'True', 'to': u"orm['auth.User']"}),
            'created_on': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isolation_datetime': ('django.db.models.fields.DateTimeField', [], {}),
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
            'supplier': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Supplier']"}),
            'viable_count': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'viable_count_unit': ('django.db.models.fields.CharField', [], {'default': "'N'", 'max_length': '1', 'blank': 'True'})
        },
        u'cellsamples.cellsubtype': {
            'Meta': {'object_name': 'CellSubtype'},
            'cell_subtype': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'cellsamples.celltype': {
            'Meta': {'ordering': "('cell_type',)", 'object_name': 'CellType'},
            'cell_subtype': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.CellSubtype']"}),
            'cell_type': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organ': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['cellsamples.Organ']"}),
            'species': ('django.db.models.fields.CharField', [], {'default': "'Human'", 'max_length': '10', 'null': 'True', 'blank': 'True'})
        },
        u'cellsamples.organ': {
            'Meta': {'ordering': "('organ_name',)", 'object_name': 'Organ'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'organ_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'})
        },
        u'cellsamples.supplier': {
            'Meta': {'object_name': 'Supplier'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['cellsamples']