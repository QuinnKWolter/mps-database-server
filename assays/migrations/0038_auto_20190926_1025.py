# Generated by Django 2.1.9 on 2019-09-26 14:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('assays', '0037'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssayPlateMap',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_on', models.DateTimeField(auto_now=True, null=True)),
                ('signed_off_date', models.DateTimeField(blank=True, null=True)),
                ('locked', models.BooleanField(default=False, help_text='Check the box and save to block automatic migration to *Public Access*, 1-year after sign off. Uncheck and save to enable automatic migration to *Public Access*, 1-year after sign off. While this is checked, automatic approvals for Stakeholders are also prevented.', verbose_name='Keep Private Indefinitely (Locked)')),
                ('flagged', models.BooleanField(default=False, help_text='Check box to flag for review')),
                ('reason_for_flag', models.CharField(blank=True, default='', help_text='Reason for why this entry was flagged', max_length=300)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(blank=True, default='', max_length=256)),
                ('device', models.CharField(choices=[('24', '24 Well Plate'), ('96', '96 Well Plate'), ('384', '384 Well Plate')], default='96', max_length=20, verbose_name='Plate Size')),
                ('row_labels', models.CharField(default='A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', max_length=250, verbose_name='Plate Row Labels')),
                ('column_labels', models.CharField(default='1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30', max_length=250, verbose_name='Plate Column Labels')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemap_created_by', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemap_modified_by', to=settings.AUTH_USER_MODEL)),
                ('signed_off_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemap_signed_off_by', to=settings.AUTH_USER_MODEL)),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assays.AssayStudy')),
            ],
            options={
                'verbose_name_plural': 'Assay Plate Map',
            },
        ),
        migrations.CreateModel(
            name='AssayPlateMapItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_on', models.DateTimeField(auto_now=True, null=True)),
                ('signed_off_date', models.DateTimeField(blank=True, null=True)),
                ('locked', models.BooleanField(default=False, help_text='Check the box and save to block automatic migration to *Public Access*, 1-year after sign off. Uncheck and save to enable automatic migration to *Public Access*, 1-year after sign off. While this is checked, automatic approvals for Stakeholders are also prevented.', verbose_name='Keep Private Indefinitely (Locked)')),
                ('flagged', models.BooleanField(default=False, help_text='Check box to flag for review')),
                ('reason_for_flag', models.CharField(blank=True, default='', help_text='Reason for why this entry was flagged', max_length=300)),
                ('name', models.CharField(max_length=100)),
                ('row_index', models.IntegerField()),
                ('column_index', models.IntegerField()),
                ('sample_replicate', models.IntegerField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '9'), ('8', '8'), ('9', '9')], default='1')),
                ('well_use', models.CharField(choices=[('sample', 'Sample'), ('standard', 'Standard'), ('blank', 'Blank'), ('empty', 'Empty/Unused')], default='sample', max_length=8, verbose_name='Well Use')),
                ('time_unit', models.CharField(choices=[('dy', 'day'), ('hr', 'hour'), ('mn', 'minute')], default='dy', max_length=8, verbose_name='Unit')),
                ('time', models.FloatField(default=0)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemapitem_created_by', to=settings.AUTH_USER_MODEL)),
                ('matrix_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='assays.AssayMatrixItem')),
                ('modified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemapitem_modified_by', to=settings.AUTH_USER_MODEL)),
                ('plate_map', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='assays.AssayPlateMap')),
                ('signed_off_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assayplatemapitem_signed_off_by', to=settings.AUTH_USER_MODEL)),
                ('study', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assays.AssayStudy')),
            ],
            options={
                'verbose_name': 'Assay Plate Map Item',
            },
        ),
        migrations.AlterUniqueTogether(
            name='assayplatemapitem',
            unique_together={('plate_map', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='assayplatemap',
            unique_together={('study', 'name')},
        ),
    ]
