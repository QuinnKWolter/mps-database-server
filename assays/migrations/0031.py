# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-09-17 17:38


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assays', '0030'),
    ]

    operations = [
        migrations.AddField(
            model_name='assaystudy',
            name='repro_nums',
            field=models.CharField(blank=True, default=b'', help_text=b'Excellent|Acceptable|Poor', max_length=40),
        ),
        migrations.AlterField(
            model_name='assaymatrixitem',
            name='test_type',
            field=models.CharField(choices=[(b'', b'--------'), (b'control', b'Control'), (b'compound', b'Treated')], max_length=8),
        ),
        migrations.AlterField(
            model_name='assaysetupcell',
            name='addition_location',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, to='assays.AssaySampleLocation'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='assaysetupcompound',
            name='addition_location',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, to='assays.AssaySampleLocation'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='assaysetupsetting',
            name='addition_location',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, to='assays.AssaySampleLocation'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='assaysetupsetting',
            name='unit',
            field=models.ForeignKey(blank=True, default=14, on_delete=django.db.models.deletion.CASCADE, to='assays.PhysicalUnits'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='assaysetupsetting',
            name='value',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='assaystudy',
            name='group',
            field=models.ForeignKey(help_text=b'Select the Data Group. The study will be bound to this group', on_delete=django.db.models.deletion.CASCADE, to='auth.Group', verbose_name=b'Data Group'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='assaystudy',
            name='restricted',
            field=models.BooleanField(default=True, help_text=b'Check box to restrict to the Access Groups selected below. Access is granted to access group(s) after Data Group admin and all designated Stakeholder Group admin(s) sign off on the study'),
        ),
    ]
