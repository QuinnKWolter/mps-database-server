# Generated by Django 2.1.8 on 2019-04-15 22:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drugtrials', '0008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drugtrial',
            name='age_unit',
            field=models.CharField(blank=True, choices=[('M', 'months'), ('Y', 'years')], default='Y', max_length=1),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='condition',
            field=models.CharField(blank=True, default='', max_length=1400),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='description',
            field=models.CharField(blank=True, default='', max_length=1400),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='figure1',
            field=models.ImageField(blank=True, null=True, upload_to='figures'),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='figure2',
            field=models.ImageField(blank=True, null=True, upload_to='figures'),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='gender',
            field=models.CharField(blank=True, choices=[('F', 'female'), ('M', 'male'), ('X', 'mixed'), ('U', 'unknown or unspecified')], default='U', max_length=1),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='population_size',
            field=models.CharField(blank=True, default='1', max_length=50),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='references',
            field=models.CharField(default='', max_length=400, verbose_name='Trial ID/Reference'),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='species',
            field=models.ForeignKey(blank=True, default='1', null=True, on_delete=django.db.models.deletion.CASCADE, to='drugtrials.Species'),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='trial_sub_type',
            field=models.CharField(choices=[('C', 'Case Report'), ('P', 'Population Report'), ('U', 'Unknown / Unspecified')], default='C', max_length=1),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='trial_type',
            field=models.CharField(choices=[('S', 'Microphysiology'), ('P', 'Preclinical'), ('C', 'Clinical'), ('M', 'Post-marketing'), ('B', 'Combined Clinical-Post Market'), ('U', 'Unknown / Unspecified')], max_length=1),
        ),
        migrations.AlterField(
            model_name='drugtrial',
            name='weight_unit',
            field=models.CharField(blank=True, choices=[('K', 'kilograms'), ('L', 'pounds')], default='L', max_length=1),
        ),
        migrations.AlterField(
            model_name='finding',
            name='description',
            field=models.CharField(blank=True, default='', max_length=400),
        ),
        migrations.AlterField(
            model_name='finding',
            name='finding_unit',
            field=models.CharField(blank=True, default='', max_length=40),
        ),
        migrations.AlterField(
            model_name='finding',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='finding_name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='drugtrials.Finding', verbose_name='Finding'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='finding_time',
            field=models.FloatField(blank=True, null=True, verbose_name='Time'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='frequency',
            field=models.CharField(blank=True, choices=[('>= 10%', '>= 10% : Very Common'), ('1 - < 10%', '1 - < 10% : Common'), ('0.1 - < 1%', '0.1 - < 1% : Uncommon'), ('0.01 - < 0.1%', '0.01 - < 0.1% : Rare'), ('< 0.01%', '< 0.01% : Very Rare')], default='', max_length=25),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='notes',
            field=models.CharField(blank=True, default='', max_length=2048),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='percent_max',
            field=models.FloatField(blank=True, null=True, verbose_name='Max Affected (% Population)'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='percent_min',
            field=models.FloatField(blank=True, null=True, verbose_name='Min Affected (% Population)'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='result',
            field=models.CharField(choices=[('0', 'Neg'), ('1', 'Pos')], default='1', max_length=8, verbose_name='Pos/Neg?'),
        ),
        migrations.AlterField(
            model_name='findingresult',
            name='severity',
            field=models.CharField(blank=True, choices=[('-1', 'UNKNOWN'), ('0', 'NEGATIVE'), ('1', '+'), ('2', '+ +'), ('3', '+ + +'), ('4', '+ + + +'), ('5', '+ + + + +')], default='-1', max_length=5, verbose_name='Severity'),
        ),
        migrations.AlterField(
            model_name='findingtreatment',
            name='concentration_unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='assays.PhysicalUnits', verbose_name='Concentration Unit'),
        ),
        migrations.AlterField(
            model_name='findingtype',
            name='description',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='findingtype',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='openfdacompound',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='openfdacompound',
            name='nonclinical_toxicology',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='openfdacompound',
            name='warnings',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='resultdescriptor',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='species',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='test',
            name='description',
            field=models.CharField(blank=True, default='', max_length=400),
        ),
        migrations.AlterField(
            model_name='test',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='test',
            name='test_name',
            field=models.CharField(max_length=40, verbose_name='Organ Function Test'),
        ),
        migrations.AlterField(
            model_name='test',
            name='test_unit',
            field=models.CharField(blank=True, default='', max_length=40),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='percent_max',
            field=models.FloatField(blank=True, null=True, verbose_name='Max Affected (% Population)'),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='percent_min',
            field=models.FloatField(blank=True, null=True, verbose_name='Min Affected (% Population)'),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='result',
            field=models.CharField(blank=True, choices=[('0', 'Neg'), ('1', 'Pos')], default='1', max_length=8, verbose_name='Pos/Neg?'),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='severity',
            field=models.CharField(blank=True, choices=[('-1', 'UNKNOWN'), ('0', 'NEGATIVE'), ('1', '+'), ('2', '+ +'), ('3', '+ + +'), ('4', '+ + + +'), ('5', '+ + + + +')], default='-1', max_length=5, verbose_name='Severity'),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='test_name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='drugtrials.Test', verbose_name='Test'),
        ),
        migrations.AlterField(
            model_name='testresult',
            name='test_time',
            field=models.FloatField(blank=True, null=True, verbose_name='Time'),
        ),
        migrations.AlterField(
            model_name='testtype',
            name='description',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='testtype',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
        migrations.AlterField(
            model_name='trialsource',
            name='description',
            field=models.CharField(blank=True, default='', max_length=400),
        ),
        migrations.AlterField(
            model_name='trialsource',
            name='locked',
            field=models.BooleanField(default=False, help_text='Check the box and save to lock the entry. Uncheck and save to enable editing.'),
        ),
    ]