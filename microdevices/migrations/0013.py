# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-26 18:13


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('diseases', '0001_initial'),
        ('microdevices', '0012'),
    ]

    operations = [
        migrations.AddField(
            model_name='microphysiologycenter',
            name='contact_web_page',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='microphysiologycenter',
            name='institution',
            field=models.CharField(default='X', max_length=400),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='microphysiologycenter',
            name='pi',
            field=models.CharField(blank=True, default=b'', max_length=250, verbose_name=b'PI'),
        ),
        migrations.AddField(
            model_name='microphysiologycenter',
            name='pi_email',
            field=models.EmailField(blank=True, default=b'', max_length=254, verbose_name=b'PI Email'),
        ),
        migrations.AddField(
            model_name='microphysiologycenter',
            name='pi_web_page',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='organmodel',
            name='disease',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='diseases.Disease'),
, on_delete=models.CASCADE        ),
        migrations.AlterField(
            model_name='microphysiologycenter',
            name='center_id',
            field=models.CharField(max_length=40, unique=True),
        ),
        migrations.AlterField(
            model_name='microphysiologycenter',
            name='name',
            field=models.CharField(max_length=400, unique=True),
        ),
    ]
