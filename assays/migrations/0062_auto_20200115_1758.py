# Generated by Django 2.1.9 on 2020-01-15 22:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assays', '0061_auto_20200115_1741'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assayplatereadermap',
            name='standard_unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='assays.PhysicalUnits'),
        ),
        migrations.AlterField(
            model_name='assayplatereadermapdatafile',
            name='description',
            field=models.CharField(blank=True, default='file added - 20200115-17:58:44', max_length=2000, null=True),
        ),
    ]
